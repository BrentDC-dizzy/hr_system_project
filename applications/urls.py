from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.application_list, name='application_list'),
    path('detail/<int:pk>/', views.application_detail, name='application_detail'),
    path('action/<int:pk>/', views.process_application_action, name='process_application_action'),
]
