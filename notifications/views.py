import json
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.utils.http import url_has_allowed_host_and_scheme
from .models import Notification, NotificationPreference

@login_required
def notification_list(request):
    notifications = Notification.objects.filter(user=request.user)
    preference, _ = NotificationPreference.objects.get_or_create(user=request.user)
    return render(
        request,
        'notifications/notification_list.html',
        {
            'notifications': notifications,
            'preference': preference,
        },
    )


@login_required
def open_notification(request, pk):
    """Mark a notification as read and redirect to its safe in-app target URL."""
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    if not notification.is_read:
        notification.is_read = True
        notification.save(update_fields=['is_read'])

    target_url = notification.target_url or ''
    if target_url and url_has_allowed_host_and_scheme(
        target_url,
        allowed_hosts={request.get_host()},
        require_https=request.is_secure(),
    ):
        return redirect(target_url)

    return redirect('notifications:notification_list')

@login_required
@require_POST
def mark_as_read(request, pk):
    notification = get_object_or_404(Notification, pk=pk, user=request.user)
    notification.is_read = True
    notification.save()
    return JsonResponse({'status': 'success'})

@login_required
@require_POST
def mark_all_as_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return JsonResponse({'status': 'success'})

@login_required
def unread_count(request):
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return JsonResponse({'count': count})

@login_required
@require_POST
def update_preferences(request):
    try:
        data = json.loads(request.body)
        preference, created = NotificationPreference.objects.get_or_create(user=request.user)
        
        if 'receive_leave_updates' in data:
            preference.receive_leave_updates = data['receive_leave_updates']
        if 'receive_approvals' in data:
            preference.receive_approvals = data['receive_approvals']
        if 'receive_evaluation_reminders' in data:
            preference.receive_evaluation_reminders = data['receive_evaluation_reminders']
        if 'receive_system_announcements' in data:
            preference.receive_system_announcements = data['receive_system_announcements']
            
        preference.save()
        return JsonResponse({'status': 'success'})
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
