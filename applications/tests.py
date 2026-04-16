from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.signals import user_logged_in

from accounts.models import Department, User
from audit.signals import log_user_login

from .models import Application, ApplicationStatusHistory


class HeadApplicationScopeTests(TestCase):
	@classmethod
	def setUpClass(cls):
		super().setUpClass()
		# FIX: Prevent unrelated audit login signal side-effects in application scope tests.
		user_logged_in.disconnect(log_user_login)

	@classmethod
	def tearDownClass(cls):
		user_logged_in.connect(log_user_login)
		super().tearDownClass()

	def setUp(self):
		# FIX: Provide a default client IP so audit login signals can persist LoginLog rows.
		self.client.defaults['REMOTE_ADDR'] = '127.0.0.1'

		self.dept_it = Department.objects.create(name='IT')
		self.dept_cba = Department.objects.create(name='CBA')

		self.head_with_department = User.objects.create_user(
			username='head_with_department',
			password='testpass123',
			role='HEAD',
			department=self.dept_it,
			must_change_password=False,
		)

		self.head_mapped_only = User.objects.create_user(
			username='head_mapped_only',
			password='testpass123',
			role='HEAD',
			department=None,
			must_change_password=False,
		)
		self.dept_cba.head = self.head_mapped_only
		self.dept_cba.save(update_fields=['head'])

		self.head_no_scope = User.objects.create_user(
			username='head_no_scope',
			password='testpass123',
			role='HEAD',
			department=None,
			must_change_password=False,
		)

		self.hr_user = User.objects.create_user(
			username='hr_user',
			password='testpass123',
			role='HR',
			must_change_password=False,
		)

		self.app_it = Application.objects.create(
			type=Application.Type.NEW_EMPLOYEE,
			applicant_name='IT Applicant',
			target_position='Instructor',
			target_department=self.dept_it,
			status=Application.Status.PENDING,
		)
		self.app_cba = Application.objects.create(
			type=Application.Type.NEW_EMPLOYEE,
			applicant_name='CBA Applicant',
			target_position='Instructor',
			target_department=self.dept_cba,
			status=Application.Status.PENDING,
		)

	def test_head_with_user_department_sees_only_department_records(self):
		self.client.force_login(self.head_with_department)

		response = self.client.get(reverse('application_list'))

		self.assertEqual(response.status_code, 200)
		self.assertContains(response, 'IT Applicant')
		self.assertNotContains(response, 'CBA Applicant')
		self.assertTrue(response.context['has_department_scope'])

	def test_head_with_department_head_mapping_but_no_user_department_still_sees_scope(self):
		self.client.force_login(self.head_mapped_only)

		response = self.client.get(reverse('application_list'))

		self.assertEqual(response.status_code, 200)
		self.assertContains(response, 'CBA Applicant')
		self.assertNotContains(response, 'IT Applicant')
		self.assertTrue(response.context['has_department_scope'])

	def test_head_with_no_scope_gets_empty_queue_and_notice(self):
		self.client.force_login(self.head_no_scope)

		response = self.client.get(reverse('application_list'))

		self.assertEqual(response.status_code, 200)
		self.assertFalse(response.context['has_department_scope'])
		self.assertContains(response, 'No department is assigned to your Head account yet')

	def test_head_cannot_view_out_of_scope_detail(self):
		self.client.force_login(self.head_with_department)

		response = self.client.get(reverse('application_detail', args=[self.app_cba.id]))

		self.assertEqual(response.status_code, 302)
		self.assertRedirects(response, reverse('application_list'))

	def test_head_cannot_action_out_of_scope_application(self):
		self.client.force_login(self.head_with_department)

		response = self.client.post(
			reverse('process_application_action', args=[self.app_cba.id]),
			data={'decision': 'Approve', 'remarks': 'Out of scope attempt'},
		)

		self.assertEqual(response.status_code, 302)
		self.assertRedirects(response, reverse('application_list'))
		self.app_cba.refresh_from_db()
		self.assertEqual(self.app_cba.status, Application.Status.PENDING)

	def test_head_can_action_in_scope_pending_application(self):
		self.client.force_login(self.head_with_department)

		response = self.client.post(
			reverse('process_application_action', args=[self.app_it.id]),
			data={'decision': 'Approve', 'remarks': 'Approved in scope'},
		)

		self.assertEqual(response.status_code, 302)
		self.assertRedirects(response, reverse('application_detail', args=[self.app_it.id]))
		self.app_it.refresh_from_db()
		self.assertEqual(self.app_it.status, Application.Status.HEAD_APPROVED)
		self.assertEqual(ApplicationStatusHistory.objects.filter(application=self.app_it).count(), 1)

	def test_hr_list_behavior_unchanged(self):
		self.client.force_login(self.hr_user)

		response = self.client.get(reverse('application_list'))

		self.assertEqual(response.status_code, 200)
		self.assertContains(response, 'IT Applicant')
		self.assertContains(response, 'CBA Applicant')
