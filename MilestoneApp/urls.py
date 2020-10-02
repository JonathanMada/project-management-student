from django.urls import path
from . import views


urlpatterns = [
    path('projects/', views.projects, name='projects'),
    path('students/', views.students, name='students'),
    path('testing/', views.testing, name='testing'),
]
