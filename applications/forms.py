from django import forms

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
