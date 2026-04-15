from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.CharField(
                choices=[
                    ('Pending', 'Pending'),
                    ('Head Approved', 'Head Approved'),
                    ('HR Approved', 'HR Approved'),
                    ('Pending SD', 'Pending SD'),
                    ('Approved', 'Approved'),
                    ('Rejected', 'Rejected'),
                ],
                default='Pending',
                max_length=50,
            ),
        ),
    ]
