import os
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import FileResponse, Http404
from django.contrib import messages

from .models import Document
from .forms import DocumentUploadForm
from accounts.models import EmployeeProfile


def _redirect_to_origin(request, user, fallback=None):
    referer = request.META.get('HTTP_REFERER')
    if referer:
        return redirect(referer)
    if fallback:
        return redirect(fallback)

    role_fallback = {
        'HR': 'history:hr_profile',
        'EMP': 'employee_profile',
        'HEAD': 'history:head_profile',
        'SD': 'history:sd_profile',
    }
    return redirect(role_fallback.get(user.role, 'login'))

@login_required
def upload_document(request):
    user = request.user

    # HR can upload for any selected employee. Self-upload is for EMP only.
    if user.role != 'HR':
        if user.role != 'EMP':
            raise PermissionDenied("Only employees with self-upload permission can upload documents.")
        try:
            profile = user.profile
        except EmployeeProfile.DoesNotExist:
            raise PermissionDenied("You do not have permission to upload documents.")

        if not getattr(profile, 'can_self_upload', False):
            raise PermissionDenied("You do not have permission to upload documents.")

    if request.method == 'POST':
        form = DocumentUploadForm(request.POST, request.FILES, user=user)
        if form.is_valid():
            document = form.save(commit=False)
            document.uploaded_by = user
            if user.role == 'HR':
                employee_id = request.POST.get('employee_id')
                if not employee_id:
                    messages.error(request, "No employee target was provided for this upload.")
                    return _redirect_to_origin(request, user, fallback='documents:view_documents')
                document.employee = get_object_or_404(EmployeeProfile, id=employee_id)
            else:
                document.employee = user.profile

            document.save()
            messages.success(request, "Document uploaded successfully.")
            return _redirect_to_origin(request, user)

        messages.error(request, "Upload failed. Please check the selected file and fields.")
        return _redirect_to_origin(request, user, fallback='documents:view_documents')

    messages.info(request, "Use the profile documents tab to upload files.")
    return _redirect_to_origin(request, user, fallback='documents:view_documents')

@login_required
def view_documents(request):
    user = request.user
    
    # Strict role-based access & FIXED template paths based on your file tree
    if user.role == 'HR':
        employee_id = request.GET.get('employee_id')
        upload_form = DocumentUploadForm(user=user)
        if employee_id:
            employee = get_object_or_404(EmployeeProfile, id=employee_id)
            documents = Document.objects.filter(employee=employee)
            return render(request, 'hr/hr_documents_employee.html', {'documents': documents, 'employee': employee, 'upload_form': upload_form})
        else:
            documents = Document.objects.all()
            return render(request, 'hr/hr_documents_employee.html', {'documents': documents, 'employee': None, 'upload_form': upload_form})
            
    elif user.role == 'EMP':
        documents = Document.objects.filter(employee__user=user)
        return render(request, 'employee/emp_documents_view.html', {'documents': documents})
        
    elif user.role == 'HEAD':
        documents = Document.objects.filter(employee__user=user)
        return render(request, 'head/head_documents_view.html', {'documents': documents})
        
    elif user.role == 'SD':
        documents = Document.objects.filter(employee__user=user)
        return render(request, 'sd/sd_documents_view.html', {'documents': documents})
        
    else:
        raise PermissionDenied("Invalid role.")

@login_required
def download_document(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    
    # Strict role-based access: HR can download any, others only their own
    if request.user.role != 'HR' and document.employee.user != request.user:
        raise PermissionDenied("You do not have permission to download this document.")

    if not document.file or not os.path.exists(document.file.path):
        raise Http404("Document not found.")
        
    response = FileResponse(open(document.file.path, 'rb'), as_attachment=True)
    return response

@login_required
def view_document_inline(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    
    # Strict role-based access: HR can view any, others only their own
    if request.user.role != 'HR' and document.employee.user != request.user:
        raise PermissionDenied("You do not have permission to view this document.")

    if not document.file or not os.path.exists(document.file.path):
        raise Http404("Document not found.")
        
    response = FileResponse(open(document.file.path, 'rb'), as_attachment=False)
    return response

@login_required
def delete_document(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    
    if request.user.role != 'HR':
        raise PermissionDenied("Only HR can delete documents.")

    if request.method == 'POST':
        if document.file:
            document.file.delete(save=False)
        document.delete()
        messages.success(request, "Document deleted successfully.")

        referer = request.META.get('HTTP_REFERER')
        if referer:
            return redirect(referer)
        return redirect('documents:view_documents')

    messages.error(request, "Invalid request method for document deletion.")
    return _redirect_to_origin(request, request.user, fallback='documents:view_documents')