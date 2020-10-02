from django.db import models
from django.dispatch import receiver
from versatileimagefield.fields import VersatileImageField
import os

# Create your models here.
class Project(models.Model):
    project_name = models.CharField(max_length=25, unique=True)
    project_detail = models.CharField(max_length=150)
    project_image = VersatileImageField(upload_to='media')

    def __str__(self):
        return self.project_name

@receiver(models.signals.post_delete, sender=Project)
def delete_Project_images(sender, instance, **kwargs):
    # Deletes Image Renditions
    instance.project_image.delete_all_created_images()
    # Deletes Original Image
    instance.project_image.delete(save=False)


class Student(models.Model):
    student_name = models.CharField(max_length=50, unique=False)
    student_project = models.ForeignKey(Project, on_delete=models.CASCADE)
    student_deadline = models.DateField()
    student_image = VersatileImageField(upload_to='profile', blank=True)

    def __str__(self):
        return self.student_name

@receiver(models.signals.post_delete, sender=Student)
def delete_Student_images(sender, instance, **kwargs):
    # Deletes Image Renditions
    instance.student_image.delete_all_created_images()
    # Deletes Original Image
    instance.student_image.delete(save=False)

@receiver(models.signals.pre_save, sender=Student)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        old_image = sender.objects.get(pk=instance.pk).student_image
    except sender.DoesNotExist:
        return False

    new_image = instance.student_image
    if not old_image == new_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)


class Task(models.Model):
    task_name = models.CharField(max_length=25, unique=True)
    task_description = models.CharField(max_length=150)
    task_deadline = models.DateField()
    task_student = models.ForeignKey(Student, on_delete=models.CASCADE)

    def __str__(self):
        return self.task_name
