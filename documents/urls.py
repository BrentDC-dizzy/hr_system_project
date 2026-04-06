from django.urls import path
from . import views

app_name = 'documents'

urlpatterns = [
    path('upload/', views.upload_document, name='upload_document'),
    path('view/', views.view_documents, name='view_documents'),
    path('download/<int:document_id>/', views.download_document, name='download_document'),
    path('delete/<int:document_id>/', views.delete_document, name='delete_document'),
]
