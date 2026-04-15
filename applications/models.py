from django.db import models
from django.conf import settings

class Application(models.Model):
    class Type(models.TextChoices):
        NEW_EMPLOYEE = 'New Employee Application', 'New Employee Application'
        POSITION_CHANGE = 'Position Change Request', 'Position Change Request'

    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        HEAD_APPROVED = 'Head Approved', 'Head Approved'
        HR_APPROVED = 'HR Approved', 'HR Approved'
        PENDING_SD = 'Pending SD', 'Pending SD'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'

    APPLICATION_TYPES = (
        ('New Employee Application', 'New Employee Application'),
        ('Position Change Request', 'Position Change Request'),
    )
    
    APPLICATION_STATUS = (
        ('Pending', 'Pending'),
        ('Head Approved', 'Head Approved'),
        ('HR Approved', 'HR Approved'),
        ('Pending SD', 'Pending SD'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )
    
    type = models.CharField(max_length=50, choices=APPLICATION_TYPES)
    applicant_name = models.CharField(max_length=255)
    applicant_info = models.TextField(blank=True, null=True)
    target_position = models.CharField(max_length=255)
    target_department = models.ForeignKey('accounts.Department', on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=50, choices=APPLICATION_STATUS, default=Status.PENDING)
    attached_documents = models.FileField(upload_to='application_documents/', blank=True, null=True)

    def __str__(self):
        return f"{self.applicant_name} - {self.type}"

class ApplicationStatusHistory(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='history')
    previous_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50)
    remarks = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.application} status changed to {self.new_status}"
