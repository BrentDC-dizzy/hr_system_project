from datetime import date

from django.contrib.auth.signals import user_logged_in
from django.test import TestCase
from django.urls import reverse

from accounts.models import Department, User
from audit.signals import log_user_login

from .models import LeaveRequest, LeaveType


class LeaveRoutingAndQueueTests(TestCase):
	@classmethod
	def setUpClass(cls):
		super().setUpClass()
		# Isolate leave tests from unrelated login-audit side effects.
		user_logged_in.disconnect(log_user_login)

	@classmethod
	def tearDownClass(cls):
		user_logged_in.connect(log_user_login)
		super().tearDownClass()

	def setUp(self):
		self.client.defaults['REMOTE_ADDR'] = '127.0.0.1'

		self.leave_type = LeaveType.objects.create(name='Vacation Leave', default_days=15)
		self.department_it = Department.objects.create(name='IT')

		self.head_user = User.objects.create_user(
			username='head_scope_user',
			password='testpass123',
			role='HEAD',
			department=None,
			must_change_password=False,
		)
		self.department_it.head = self.head_user
		self.department_it.save(update_fields=['head'])

		self.employee_user = User.objects.create_user(
			username='employee_scope_user',
			password='testpass123',
			role='EMP',
			department=self.department_it,
			must_change_password=False,
		)

		self.hr_user = User.objects.create_user(
			username='hr_scope_user',
			password='testpass123',
			role='HR',
			must_change_password=False,
		)

		self.sd_user = User.objects.create_user(
			username='sd_scope_user',
			password='testpass123',
			role='SD',
			must_change_password=False,
		)

		self.subordinate_pending_head = LeaveRequest.objects.create(
			user=self.employee_user,
			leave_type=self.leave_type,
			start_date=date(2026, 4, 1),
			end_date=date(2026, 4, 1),
			days_requested=1,
			reason='Subordinate queue request',
			status=LeaveRequest.Status.PENDING_HEAD_APPROVAL,
		)

		self.head_own_request = LeaveRequest.objects.create(
			user=self.head_user,
			leave_type=self.leave_type,
			start_date=date(2026, 4, 2),
			end_date=date(2026, 4, 2),
			days_requested=1,
			reason='Head personal request',
			status=LeaveRequest.Status.PENDING_HEAD_APPROVAL,
		)

		self.employee_pending_hr = LeaveRequest.objects.create(
			user=self.employee_user,
			leave_type=self.leave_type,
			start_date=date(2026, 4, 3),
			end_date=date(2026, 4, 3),
			days_requested=1,
			reason='Employee request for SD routing check',
			status=LeaveRequest.Status.PENDING_HR_APPROVAL,
		)

	def test_head_dashboard_quick_action_points_to_queue_mode(self):
		self.client.force_login(self.head_user)

		response = self.client.get(reverse('head_dashboard'))

		self.assertEqual(response.status_code, 200)
		self.assertEqual(
			response.context['quick_action_urls']['view_leaves'],
			f"{reverse('leaves:head_leave_history')}?queue=1",
		)

	def test_head_queue_mode_returns_subordinate_requests_not_personal_fallback(self):
		self.client.force_login(self.head_user)

		response = self.client.get(
			f"{reverse('leaves:head_leave_history')}?format=json&queue=1",
			HTTP_ACCEPT='application/json',
		)

		self.assertEqual(response.status_code, 200)
		history_ids = [item['id'] for item in response.json()['history']]
		self.assertIn(self.subordinate_pending_head.id, history_ids)
		self.assertNotIn(self.head_own_request.id, history_ids)

	def test_hr_approval_auto_approves_employee_leave_without_sd_queue(self):
		self.client.force_login(self.hr_user)

		response = self.client.post(
			reverse('leaves:hr_final_approve', args=[self.employee_pending_hr.id]),
			data={'action': 'APPROVE', 'remarks': 'Forward to SD queue'},
		)

		self.assertEqual(response.status_code, 302)
		self.employee_pending_hr.refresh_from_db()
		self.assertEqual(self.employee_pending_hr.status, LeaveRequest.Status.APPROVED)

	def test_sd_overview_shows_employee_leave_in_pending_section(self):
		self.employee_pending_hr.status = LeaveRequest.Status.PENDING_SD_APPROVAL
		self.employee_pending_hr.save(update_fields=['status'])

		self.client.force_login(self.sd_user)

		response = self.client.get(reverse('leaves:sd_leave_overview'))

		self.assertEqual(response.status_code, 200)
		pending_ids = list(response.context['pending_requests'].values_list('id', flat=True))
		self.assertIn(self.employee_pending_hr.id, pending_ids)

	def test_sd_overview_template_loads_static_js_module(self):
		self.client.force_login(self.sd_user)

		response = self.client.get(reverse('leaves:sd_leave_overview'))

		self.assertEqual(response.status_code, 200)
		self.assertContains(response, 'js/sd/sd_leaverequest.js')
		self.assertNotContains(response, "document.addEventListener('DOMContentLoaded', function () {")
