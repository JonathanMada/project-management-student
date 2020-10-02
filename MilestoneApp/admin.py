from django.contrib import admin
from .models import Project, Student, Task

# Register your models here.
admin.site.register(Project)
admin.site.register(Student)
admin.site.register(Task)
