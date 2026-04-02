from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Department

class CustomUserAdmin(UserAdmin):
    model = User
    # This allows you to see and edit your custom fields in the standard Django admin
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': (
            'role', 
            'department', 
            'profile_pic', 
            'is_locked', 
            'failed_login_attempts', 
            'must_change_password', 
            'last_password_change'
        )}),
    )
    list_display = ['username', 'email', 'role', 'department', 'is_staff', 'is_locked']
    list_filter = ['role', 'department', 'is_locked', 'is_staff']

admin.site.register(User, CustomUserAdmin)
admin.site.register(Department)
