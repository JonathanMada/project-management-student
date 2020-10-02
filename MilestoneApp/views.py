from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Project, Student, Task
from .forms import ProjectForm, StudentForm, TaskForm
# from django.http import HttpResponse

# Create your views here.
def projects(request):
    project_form = ProjectForm()
    projects = Project.objects.all().order_by('-id')
    response_data = {}

    # This creates a new object
    if request.is_ajax() and request.method == 'POST':
        project_form = ProjectForm(request.POST, request.FILES)

        if project_form.is_valid():
            project_form.save(commit=True)

            response_data['name'] = project_form.cleaned_data['project_name']
            response_data['detail'] = project_form.cleaned_data['project_detail']
            response_data['image'] = Project.objects.get(project_name=response_data['name']).project_image.url
            response_data['id'] = Project.objects.get(project_name=response_data['name']).id

            return JsonResponse(response_data, status=200)


    if request.is_ajax() and request.method == 'GET':

        # This remove an object
        if request.GET.get('form_name') == 'delete-card':
            name = request.GET.get('project_name')
            project = Project.objects.get(project_name=name)
            project.delete()

        # This gets all the students related to a project
        if request.GET.get('form_name') == 'show-list':
            student_API = []
            id = request.GET.get('the_project')
            project = Project.objects.get(pk=id)
            student_list = Student.objects.filter(student_project=project)
            for student in student_list:
                response_data['image'] = student.student_image.url
                response_data['name'] = student.student_name
                response_data['deadline'] = student.student_deadline
                student_API.append(response_data.copy())
            return JsonResponse(student_API, safe=False)

    return render(request, 'MilestoneApp/project.html', {'project_form': project_form, 'project_list': projects})


def students(request):
    student_form = StudentForm()
    students = Student.objects.all()
    projects = Project.objects.all()
    response_data = {}

    if request.is_ajax() and request.method == 'POST':
        student_form = StudentForm(request.POST, request.FILES)

        # This takes new registration
        if student_form.is_valid() and request.POST.get('purpose') == 'create':
            student_form.save(commit=True)

            response_data['name'] = student_form.cleaned_data['student_name']
            response_data['project'] = student_form.cleaned_data['student_project'].project_name
            response_data['deadline'] = student_form.cleaned_data['student_deadline']
            response_data['image'] = Student.objects.get(student_name=response_data['name']).student_image.url
            response_data['id'] = Student.objects.get(student_name=response_data['name']).id
            print(response_data)

            return JsonResponse(response_data, status=200)

        # This modifies existing objects
        if student_form.is_valid() and request.POST.get('purpose') == 'edit':
            print(student_form.cleaned_data['student_name'])
            print(request.POST['student_name'])

            id = request.POST['student_id']
            # print(Project.objects.get(pk = request.POST['student_project']).project_name)
            get_project = Project.objects.get(pk = request.POST['student_project'])
            edit_student = Student.objects.get(pk = id)
            edit_student.student_name = request.POST['student_name']
            edit_student.student_project = get_project
            edit_student.student_deadline = request.POST['student_deadline']
            try:
                edit_student.student_image = request.FILES['student_image']
            # This handle any errors related to image upload
            # Django is going to ignore it in case it is empty
            except:
                pass
            edit_student.save()

            response_data['id'] = edit_student.id
            response_data['name'] = edit_student.student_name
            response_data['project'] = get_project.project_name
            response_data['deadline'] = edit_student.student_deadline
            response_data['image'] = edit_student.student_image.url
            print(response_data)

            return JsonResponse(response_data, status=200)

    # This delete an object
    if request.is_ajax() and request.method == 'GET':

        # This removes one specific item
        if request.GET.get('button_name') == 'remove-item':
            id = request.GET.get('student_id')
            student = Student.objects.get(pk=id)
            student.delete()

        # This removes multiple items
        elif request.GET.get('button_name') == 'multi-delete':
            students = (request.GET.getlist('students'))[0].split(',')
            for student in students:
                Student.objects.get(pk=int(student)).delete()

    return render(request, 'MilestoneApp/students.html', {'student_form': student_form,
                                                          'student_list': students,
                                                          'project_exists': projects})


def testing(request):
    list_project = Project.objects.all()
    data_test = {
        'testings': list_project,
    }
    return render(request, 'MilestoneApp/test.html', context=data_test)
