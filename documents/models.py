from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

class Document(models.Model):
    DOCUMENT_TYPES = (
        ('Contract', 'Contract'),
        ('Transcript', 'Transcript'),
        ('Certifications', 'Certifications'),
        ('Other', 'Other'),
    )

    # FIXED: String reference prevents circular imports
    employee = models.ForeignKey('accounts.EmployeeProfile', on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='documents/')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    upload_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateField(null=True, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')

    @property
    def is_approaching_expiry(self):
        if not self.expiry_date:
            return False
        today = timezone.now().date()
        return today <= self.expiry_date <= today + timedelta(days=30)

    @property
    def is_expired(self):
        if not self.expiry_date:
            return False
        return self.expiry_date < timezone.now().date()

    def __str__(self):
        return f"{self.document_type} - {self.employee.user.get_full_name()}"