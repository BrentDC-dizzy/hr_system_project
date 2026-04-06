from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Count, Q
from django.utils import timezone
from django.contrib import messages

from .models import AttendanceLog
from .forms import AttendanceEditForm
from accounts.models import User

# Create your views here.

# --- Helper functions for role checks ---
def is_hr_or_admin(user):
    return user.is_authenticated and user.role in ['HR', 'ADMIN']

def is_head(user):
    return user.is_authenticated and user.role == 'HEAD'

def is_sd_or_admin(user):
    # Assuming School Director (SD) is a role or we can just use ADMIN for summaries
    return user.is_authenticated and user.role in ['ADMIN'] # Add 'SD' if you create that role


# @login_required # Temporarily commented out for testing
# @user_passes_test(is_hr_or_admin) # Temporarily commented out for testing
def hr_attendance(request):
    """
    Displays all attendance logs for HR and Admins.
    """
    logs = AttendanceLog.objects.select_related('employee', 'edited_by').order_by('-date', 'employee__last_name')
    context = {
        'attendance_logs': logs,
        'page_title': 'Master Attendance Log'
    }
    return render(request, 'attendance/hr_attendance.html', context)

# @login_required # Temporarily commented out for testing
def emp_attendance(request):
    """
    Displays attendance logs for the currently logged-in employee.
    """
    # --- TEMPORARY TESTING CODE ---
    # Use the logged-in user if available, otherwise grab the first user as a dummy.
    if request.user.is_authenticated:
        employee = request.user
    else:
        employee = User.objects.first() # Fallback for testing
    # --- END TEMPORARY CODE ---

    if employee:
        logs = AttendanceLog.objects.filter(employee=employee).order_by('-date')
    else:
        logs = AttendanceLog.objects.none() # No users in DB

    context = {
        'attendance_logs': logs,
        'page_title': 'My Attendance Records'
    }
    return render(request, 'attendance/emp_attendance.html', context)

# @login_required # Temporarily commented out for testing
# @user_passes_test(is_head) # Temporarily commented out for testing
def head_attendance(request):
    """
    Displays attendance logs for employees in the department of the logged-in Head.
    """
    # --- TEMPORARY TESTING CODE ---
    if request.user.is_authenticated and request.user.role == 'HEAD':
        department = request.user.department
    else:
        # Fallback for testing: find the first department that has a head.
        head_user = User.objects.filter(role='HEAD').first()
        department = head_user.department if head_user else None
    # --- END TEMPORARY CODE ---

    logs = AttendanceLog.objects.filter(employee__department=department).select_related('employee').order_by('-date', 'employee__last_name') if department else AttendanceLog.objects.none()
    
    context = {
        'attendance_logs': logs,
        'department': department,
        'page_title': f'{department.name} Department Attendance' if department else 'Department Attendance'
    }
    return render(request, 'attendance/head_attendance.html', context)

# @login_required # Temporarily commented out for testing
# @user_passes_test(is_sd_or_admin) # Temporarily commented out for testing
def sd_attendance(request):
    """
    Displays an aggregated summary of attendance for today.
    """
    today = timezone.now().date()
    summary = AttendanceLog.objects.filter(date=today).aggregate(
        present_count=Count('id', filter=Q(status='PRESENT')),
        absent_count=Count('id', filter=Q(status='ABSENT')),
        late_count=Count('id', filter=Q(status='LATE')),
        undertime_count=Count('id', filter=Q(status='UNDERTIME')),
    )
    context = {
        'summary': summary,
        'total_employees': User.objects.filter(is_active=True).count(),
        'summary_date': today,
        'page_title': 'Daily Attendance Summary'
    }
    return render(request, 'attendance/sd_attendance.html', context)

# @login_required # Temporarily commented out for testing
# @user_passes_test(is_hr_or_admin) # Temporarily commented out for testing
def edit_log(request, log_id):
    """
    Handles the editing of a specific attendance log by HR/Admin.
    """
    log_instance = get_object_or_404(AttendanceLog, id=log_id)
    
    if request.method == 'POST':
        form = AttendanceEditForm(request.POST, instance=log_instance)
        if form.is_valid():
            log = form.save(commit=False)
            log.edited_by = request.user
            log.save()
            messages.success(request, f"Attendance log for {log_instance.employee.get_full_name()} on {log_instance.date} has been updated.")
            return redirect('attendance:hr_attendance')
    else:
        form = AttendanceEditForm(instance=log_instance)
        
    context = {
        'form': form,
        'log': log_instance,
        'page_title': f'Edit Log for {log_instance.employee.get_full_name()}'
    }
    return render(request, 'attendance/edit_log.html', context)
