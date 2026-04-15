from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('leaves', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='leaverequest',
            name='reviewed_by_sd',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='sd_approved_leaves',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name='leaverequest',
            name='sd_remarks',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='leaverequest',
            name='status',
            field=models.CharField(
                choices=[
                    ('PENDING_HEAD', 'Pending Head Approval'),
                    ('PENDING_HR', 'Pending HR Approval'),
                    ('PENDING_SD', 'Pending SD Approval'),
                    ('APPROVED', 'Approved'),
                    ('REJECTED', 'Rejected'),
                    ('CANCELLED', 'Cancelled'),
                ],
                default='PENDING_HEAD',
                max_length=20,
            ),
        ),
    ]
