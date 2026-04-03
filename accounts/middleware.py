from django.shortcuts import redirect
from django.urls import reverse

class EnforcePasswordChangeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated and getattr(request.user, 'must_change_password', False):
            allowed_paths = [reverse('password_change'), reverse('logout')]
            # Allow them to navigate to the password change view, logout, or load static media
            if request.path not in allowed_paths and not request.path.startswith('/static/') and not request.path.startswith('/media/'):
                return redirect('password_change')
                
        return self.get_response(request)