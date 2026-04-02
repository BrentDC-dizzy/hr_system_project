from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    # This 'name' is what your redirect() uses
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('employee-dashboard/', views.employee_dashboard, name='employee_dashboard'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    
    # New URLs for user management
    path('create-user/', views.create_user, name='create_user'),
    path('edit-user/<int:user_id>/', views.edit_user, name='edit_user'), # POST for saving
    path('get-user-data/<int:user_id>/', views.get_user_data, name='get_user_data'), # GET for fetching
    path('assign-role/', views.assign_role, name='assign_role'),
    path('update-account-status/', views.update_account_status, name='update_account_status'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('delete-user/', views.delete_user, name='delete_user'),
    path('password-change/', views.password_change, name='password_change'), # Placeholder
]