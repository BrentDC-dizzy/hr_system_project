from django import forms
from .models import Application

class ApplicationActionForm(forms.Form):
    DECISION_CHOICES = (
        ('Approve', 'Approve'),
        ('Reject', 'Reject'),
        ('Forward', 'Forward'),
    )
    decision = forms.ChoiceField(
        choices=DECISION_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    remarks = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
        required=False
    )

    def __init__(self, *args, user_role=None, **kwargs):
        super().__init__(*args, **kwargs)

        role = (user_role or '').upper()
        if role == 'SD':
            self.fields['decision'].choices = (
                ('Approve', 'Approve'),
                ('Reject', 'Reject'),
            )
        elif role in {'HEAD', 'HR'}:
            self.fields['decision'].choices = self.DECISION_CHOICES

class PositionChangeRequestForm(forms.ModelForm):
    class Meta:
        model = Application
        fields = ['target_position', 'target_department', 'applicant_info', 'attached_documents']
