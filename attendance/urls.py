from django.urls import path
from django.views.generic import RedirectView
from . import views

app_name = 'attendance'

urlpatterns = [
    # Add a redirect from the app's root to the employee records page
    path('', RedirectView.as_view(pattern_name='attendance:employee_attendance_records'), name='index'),
    
    # For HR/Admin to view all records
    path('hr/', views.hr_attendance, name='hr_attendance'),
    # For Employees to view their own records
    path('my-records/', views.emp_attendance, name='employee_attendance_records'),
    # For Department Heads to view their department's records
    path('department/', views.head_attendance, name='head_department_attendance'),
    # For School Director/Admin to view summaries
    path('summary/', views.sd_attendance, name='sd_attendance_summary'),
    # For HR/Admin to edit a specific log
    path('edit/<int:log_id>/', views.edit_log, name='edit_attendance_log'),
]