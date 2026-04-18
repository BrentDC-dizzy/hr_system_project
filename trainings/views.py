from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Count, F
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from django.utils import timezone

from utils.decorators import role_required

from .forms import TrainingForm
from .models import TrainingParticipant, TrainingSession


PARTICIPANT_STATUS_CHOICES = [
	{'value': status, 'label': label}
	for status, label in TrainingParticipant.STATUS_CHOICES
]


def _status_to_ui(status):
	if status == TrainingSession.STATUS_CANCELLED:
		return 'cancelled', 'Cancelled'
	if status == TrainingSession.STATUS_CLOSED:
		return 'closed', 'Closed Registration'
	return 'open', 'Open'


def _resolve_trainer_name(training):
	if training.trainer:
		return training.trainer.get_full_name() or training.trainer.username
	if training.trainer_name:
		return training.trainer_name
	return 'TBA'


def _serialize_training(training):
	participant_count = getattr(training, 'participant_count', None)
	if participant_count is None:
		participant_count = training.participants.count()

	ui_status, ui_status_label = _status_to_ui(training.status)
	is_full = participant_count >= training.max_participants
	slots_left = max(training.max_participants - participant_count, 0)
	progress = 'At capacity' if is_full and training.status == TrainingSession.STATUS_ACTIVE else 'Enrollment open'

	if training.status == TrainingSession.STATUS_CLOSED:
		progress = 'Closed'
	elif training.status == TrainingSession.STATUS_CANCELLED:
		progress = 'Session cancelled'

	return {
		'id': training.id,
		'display_id': str(training.id).zfill(3),
		'name': training.name,
		'category': training.category,
		'date': training.date.strftime('%m/%d/%Y'),
		'date_display': training.date.strftime('%b %d, %Y'),
		'date_for_form': training.date.isoformat(),
		'mode': training.get_mode_display(),
		'slots_text': f'{participant_count} / {training.max_participants}',
		'slots_left': slots_left,
		'slots_left_text': f'{slots_left} left',
		'filled': participant_count,
		'total': training.max_participants,
		'progress': progress,
		'status': ui_status,
		'status_label': ui_status_label,
		'status_code': training.status,
		'remarks': training.description or 'No additional details provided.',
		'trainer': _resolve_trainer_name(training),
		'trainer_name': training.trainer_name or '',
	}


@login_required
@role_required('HR')
def hr_training_list(request):
	trainings = TrainingSession.objects.annotate(participant_count=Count('participants')).order_by('-date', '-id')
	form = TrainingForm()
	context = {
		'trainings': trainings,
		'training_rows': [_serialize_training(training) for training in trainings],
		'training_form': form,
		'participant_status_choices': PARTICIPANT_STATUS_CHOICES,
	}
	return render(request, 'hr/hr_training.html', context)


@login_required
@role_required('HR')
def hr_training_create(request):
	if request.method == 'POST':
		form = TrainingForm(request.POST)
		if form.is_valid():
			form.save()
			messages.success(request, 'Training session created successfully.')
		else:
			messages.error(request, 'Please fix the highlighted training form errors.')
	return redirect('trainings:hr_training_list')


@login_required
@role_required('HR')
def hr_training_edit(request, training_id):
	training = get_object_or_404(TrainingSession, pk=training_id)
	if request.method == 'POST':
		form = TrainingForm(request.POST, instance=training)
		if form.is_valid():
			form.save()
			messages.success(request, 'Training session updated successfully.')
		else:
			messages.error(request, 'Unable to update training session. Please check the input values.')
		return redirect('trainings:hr_training_list')

	form = TrainingForm(instance=training)
	trainings = TrainingSession.objects.annotate(participant_count=Count('participants')).order_by('-date', '-id')
	context = {
		'trainings': trainings,
		'training_rows': [_serialize_training(item) for item in trainings],
		'training_form': form,
		'editing_training': training,
		'participant_status_choices': PARTICIPANT_STATUS_CHOICES,
	}
	return render(request, 'hr/hr_training.html', context)


@login_required
@role_required('HR')
@require_POST
def hr_training_update_status(request, training_id):
	training = get_object_or_404(TrainingSession, pk=training_id)
	requested_status = request.POST.get('status', '').upper()

	if requested_status not in {
		TrainingSession.STATUS_ACTIVE,
		TrainingSession.STATUS_CLOSED,
		TrainingSession.STATUS_CANCELLED,
	}:
		messages.error(request, 'Invalid training status value.')
		return redirect('trainings:hr_training_list')

	training.status = requested_status
	training.save(update_fields=['status', 'updated_at'])
	messages.success(request, f'Training status updated to {training.get_status_display()}.')
	return redirect('trainings:hr_training_list')


@login_required
@role_required('HR')
def hr_training_participants(request, training_id):
	training = get_object_or_404(TrainingSession, pk=training_id)
	participants = (
		TrainingParticipant.objects
		.filter(training_session=training)
		.select_related('employee')
		.order_by('employee__last_name', 'employee__first_name')
	)

	payload = {
		'training': {
			'id': training.id,
			'name': training.name,
			'status': training.status,
			'status_display': training.get_status_display(),
			'max_participants': training.max_participants,
		},
		'participants': [
			{
				'id': row.id,
				'employee_id': row.employee.id,
				'employee_name': row.employee.get_full_name() or row.employee.username,
				'department': row.employee.department.get_name_display() if row.employee.department else 'Unassigned',
				'status': row.status,
				'status_display': row.get_status_display(),
				'registered_at': row.registered_at.isoformat(),
			}
			for row in participants
		],
		'status_choices': PARTICIPANT_STATUS_CHOICES,
	}
	return JsonResponse(payload)


@login_required
@role_required('HR')
@require_POST
def hr_training_update_participant_status(request, training_id, participant_id):
	training = get_object_or_404(TrainingSession, pk=training_id)
	participant = get_object_or_404(
		TrainingParticipant,
		pk=participant_id,
		training_session=training,
	)

	requested_status = request.POST.get('status', '').upper()
	allowed_statuses = {status for status, _label in TrainingParticipant.STATUS_CHOICES}
	if requested_status not in allowed_statuses:
		messages.error(request, 'Invalid participant status value.')
		return redirect('trainings:hr_training_list')

	participant.status = requested_status
	participant.save(update_fields=['status', 'updated_at'])
	messages.success(request, 'Participant status updated successfully.')
	return redirect('trainings:hr_training_list')


@login_required
@role_required('EMP')
def employee_trainings(request):
	now_date = timezone.localdate()

	available_trainings = (
		TrainingSession.objects
		.filter(status=TrainingSession.STATUS_ACTIVE)
		.filter(date__gte=now_date)
		.annotate(participant_count=Count('participants'))
		.filter(participant_count__lt=F('max_participants'))
		.exclude(participants__employee=request.user)
		.order_by('date', 'name')
		.distinct()
	)

	my_participations = (
		TrainingParticipant.objects
		.filter(employee=request.user)
		.select_related('training_session')
		.order_by('-training_session__date', '-registered_at')
	)

	context = {
		'available_trainings': available_trainings,
		'my_participations': my_participations,
		'available_training_cards': [_serialize_training(training) for training in available_trainings],
	}
	return render(request, 'employee/emp_training.html', context)


@login_required
@role_required('EMP')
@require_POST
def employee_register_training(request, training_id):
	training = get_object_or_404(TrainingSession, pk=training_id)

	if training.status != TrainingSession.STATUS_ACTIVE:
		messages.error(request, 'This training is not open for registration.')
		return redirect('trainings:employee_trainings')

	current_count = TrainingParticipant.objects.filter(training_session=training).count()
	if current_count >= training.max_participants:
		messages.error(request, 'Registration limit has been reached for this training.')
		return redirect('trainings:employee_trainings')

	participant, created = TrainingParticipant.objects.get_or_create(
		employee=request.user,
		training_session=training,
		defaults={'status': TrainingParticipant.STATUS_REGISTERED},
	)

	if created:
		messages.success(request, 'You have been registered successfully.')
	else:
		messages.info(request, 'You are already registered for this training.')

	return redirect('trainings:employee_trainings')


@login_required
@role_required('HEAD')
def head_training_overview(request):
	subordinate_participations = TrainingParticipant.objects.exclude(employee=request.user)

	# FIX: Gracefully handle users without a department by avoiding forced empty queryset.
	if request.user.department_id is not None:
		subordinate_participations = subordinate_participations.filter(employee__department=request.user.department)

	subordinate_participations = (
		subordinate_participations
		.select_related('employee', 'employee__department', 'training_session')
		.order_by('-training_session__date', 'employee__last_name', 'employee__first_name')
	)

	context = {
		'subordinate_participations': subordinate_participations,
		'department': request.user.department,
		'has_department': request.user.department_id is not None,
	}
	return render(request, 'head/head_training.html', context)
