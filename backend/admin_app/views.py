from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes
from django.urls import reverse
from django.contrib.auth import login,logout

from django.shortcuts import render,redirect,get_object_or_404
from admin_app.forms import DepartmentsForm,DesignationForm,CompanyForm, LoginForm, MenuForm, SubMenuForm,UserForm
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Department,Designation,Company, Menu, MenuPermission, SubMenu, UserProfile,CustomUser
from django.core.exceptions import ValidationError
from django.contrib import messages
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    profile = getattr(user, 'customer_profile', None)
    return Response({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": profile.phone if profile else None,
        "dob": profile.dob if profile else None,
    })


class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(token),
                "access": str(token.access_token),
                "message": "Registration successful"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(token),
                "access": str(token.access_token),
                "message": "Login successful"
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
def admin_dashboard(request):
    return render(request, 'admin/index.html')

# ---------------- MENU VIEWS ----------------
def menu_list(request):
    menus = Menu.objects.all().order_by('id')
    return render(request, 'admin/menu_list.html', {'menus': menus})


def add_menu(request):
    if request.method == 'POST':
        form = MenuForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Menu added successfully!")
            return redirect('menu_list')
    else:
        form = MenuForm()
    return render(request, 'admin/add_menu.html', {'form': form})


def edit_menu(request, pk):
    menu = get_object_or_404(Menu, pk=pk)
    form = MenuForm(request.POST or None, instance=menu)
    if form.is_valid():
        form.save()
        messages.success(request, "Menu updated successfully!")
        return redirect('menu_list')
    return render(request, 'admin/add_menu.html', {'form': form, 'edit_mode': True})


def delete_menu(request, pk):
    menu = get_object_or_404(Menu, pk=pk)
    menu.delete()
    messages.success(request, "Menu deleted successfully!")
    return redirect('menu_list')


# ---------------- SUBMENU VIEWS ----------------
def submenu_list(request):
    submenus = SubMenu.objects.select_related('menu').all()
    return render(request, 'admin/submenu_list.html', {'submenus': submenus})


def add_submenu(request):
    if request.method == 'POST':
        form = SubMenuForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Submenu added successfully!")
            return redirect('submenu_list')
    else:
        form = SubMenuForm()
    return render(request, 'admin/add_submenu.html', {'form': form})


def edit_submenu(request, pk):
    submenu = get_object_or_404(SubMenu, pk=pk)
    form = SubMenuForm(request.POST or None, instance=submenu)
    if form.is_valid():
        form.save()
        messages.success(request, "Submenu updated successfully!")
        return redirect('submenu_list')
    return render(request, 'admin/add_submenu.html', {'form': form, 'edit_mode': True})


def delete_submenu(request, pk):
    submenu = get_object_or_404(SubMenu, pk=pk)
    submenu.delete()
    messages.success(request, "Submenu deleted successfully!")
    return redirect('submenu_list')

def assign_submenu_permissions(request, user_id):
    profile = get_object_or_404(UserProfile, user_id=user_id)
    
    # Get all menus with their submenus as **lists**
    menus = []
    for menu in Menu.objects.prefetch_related('submenus').all():
        menus.append({
            "menu": menu,
            "submenus": list(menu.submenus.all())  # convert RelatedManager to list
        })

    # Existing permissions for this user profile
    allowed_submenus = list(
        MenuPermission.objects.filter(user_profile=profile)
        .values_list('submenu_id', flat=True)
    )

    if request.method == "POST":
        selected_submenu_ids = []
        for menu_item in menus:
            for sub in menu_item["submenus"]:  # iterate Python list
                if request.POST.get(f"submenu_{sub.id}") == "on":
                    selected_submenu_ids.append(sub.id)

        # Remove unselected permissions
        MenuPermission.objects.filter(user_profile=profile).exclude(
            submenu_id__in=selected_submenu_ids
        ).delete()

        # Add newly selected permissions
        for sub_id in selected_submenu_ids:
            MenuPermission.objects.get_or_create(
                user_profile=profile, submenu_id=sub_id
            )

        return redirect('user_list')

    return render(request, "admin/assign_submenu_permission.html", {
        "profile": profile,
        "menus": menus,
        "allowed_submenus": allowed_submenus,
    })
    
# Create your views here.


def add_department(request):
    if request.method == 'POST':
        form = DepartmentsForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('department_hierarchy')  
    else:
        form = DepartmentsForm()
    
    return render(request, 'admin/add_department.html', {'form': form})

def department_list(request):
    search_query = request.GET.get('q', '')  # Get search term from URL (?q=...)

    if search_query:
        # Filter departments by name or description (case-insensitive)
        departments = Department.objects.filter(
            Q(department_name__icontains=search_query) |
            Q(description__icontains=search_query)
        ).order_by('id')
    else:
        departments = Department.objects.all().order_by('id')

    # Pagination: 5 items per page
    paginator = Paginator(departments, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'admin/department_list.html', {
        'page_obj': page_obj,
        'search_query': search_query
    })


def edit_department(request, pk):
    department = get_object_or_404(Department, pk=pk)
    if request.method == 'POST':
        form = DepartmentsForm(request.POST, instance=department)
        if form.is_valid():
            form.save()
            return redirect('department_hierarchy')  
    else:
        form = DepartmentsForm(instance=department)
    return render(request, 'admin/add_department.html', {'form': form})


def delete_department(request,id):
    department=get_object_or_404(Department,id=id)
    department.delete()
    return redirect('department_hierarchy')


def add_designation(request):
    form = DesignationForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        form.save()
        return redirect('department_hierarchy')
    return render(request, 'admin/add_designation.html', {'form': form})

def designation_list(request):
    search_query = request.GET.get('q', '')  # Search query from the URL
    #ProductImage.objects.select_related('material').all().order_by('display_order')

    if search_query:
        # Filter by designation name or description
        designations = Designation.objects.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query)
        ).order_by('id')
    else:
        designations = Designation.objects.all().order_by('id')

    # Pagination: 5 records per page
    paginator = Paginator(designations, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'admin/designation_list.html', {
        'page_obj': page_obj,
        'search_query': search_query
    })

def edit_designation(request, pk):
    department = get_object_or_404(Designation, pk=pk)
    if request.method == 'POST':
        form = DesignationForm(request.POST, instance=department)
        if form.is_valid():
            form.save()
            return redirect('department_hierarchy')  
    else:
        form = DesignationForm(instance=department)
    return render(request, 'admin/add_designation.html', {'form': form})

def delete_designation(request,id):
    department=get_object_or_404(Designation,id=id)
    department.delete()
    return redirect('department_hierarchy')

def department_hierarchy(request):
    departments = Department.objects.prefetch_related('designations').all()
    return render(request, 'admin/department_hierarchy.html', {'departments': departments})

def add_company(request):
    if request.method == 'POST':
        form = CompanyForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('company_list')  
    else:
        form = CompanyForm()  
    return render(request, 'admin/add_company.html', {'form': form})

def company_list(request):
    companies = Company.objects.all()
    return render(request, 'admin/company_list.html', {'companies': companies})

def edit_company(request, pk):
    company = get_object_or_404(Company, pk=pk)
    
    if request.method == 'POST':
        form = CompanyForm(request.POST, request.FILES, instance=company)  # Include request.FILES
        if form.is_valid():
            form.save()
            return redirect('company_list')  # Redirect to company list after saving
    else:
        form = CompanyForm(instance=company)
    
    return render(request, 'admin/add_company.html', {
        'form': form,
        'edit_mode': True,  # optional: to show "Edit Company" instead of "Add Company" in template
    })

def delete_company(request,id):
    company=get_object_or_404(Company,id=id)
    company.delete()
    return redirect('company_list')



def register_user(request):
    if request.method == "POST":
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                form.save()
                messages.success(request, "User registered successfully!")
                return redirect("user_list")  # or wherever you want to go after registration
            except ValidationError as e:
                messages.error(request, e.message)
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = UserForm()
    return render(request, "admin/register_user.html", {"form": form})

def user_list(request):
    search_query = request.GET.get('q', '')
    users = UserProfile.objects.select_related('user', 'department', 'designation').all()

    if search_query:
        users = users.filter(
            user__name__icontains=search_query
        ) | users.filter(
            user__email__icontains=search_query
        )

    # Pagination — 10 users per page
    paginator = Paginator(users, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'admin/user_list.html', {
        'page_obj': page_obj,
        'search_query': search_query
    })


def delete_user(request,id):
    userprofile=get_object_or_404(CustomUser,id=id)
    userprofile.delete()
    return redirect('user_list')

def edit_user(request, pk):
    userprofile = get_object_or_404(UserProfile, pk=pk)
    user = userprofile.user  
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES, instance=user, profile_instance=userprofile)
        if form.is_valid():
            form.save()
            return redirect('user_list')
    else:
        form = UserForm(instance=user, profile_instance=userprofile)
        form.fields.pop('password1', None)
        form.fields.pop('password2', None)

    return render(request, 'admin/register_user.html', {
        'form': form,
        'edit_mode': True,
    })

########## LOGIN & LOGOUT #########
from django.contrib.auth import authenticate,login
from django.contrib.auth import get_user_model

def login_view(request):
    if request.method == "POST":
        print("POST request received")
        form = LoginForm(request.POST)
        print(form.errors, "form errors")
        if form.is_valid():
            print("form is valid")
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            print(email, password, "login credentials")

            # authenticate using email
            user = authenticate(request, email=email, password=password)
            print(user, "authenticated user")

            if user is not None:
                login(request, user)

                # Redirect based on user type
                if user.is_superuser:
                    return redirect("admin_dashboard")  # super admin

                else:
                    return redirect("admin_dashboard")  # regular user
                    # Check for UserProfile


            else:
                messages.error(request, "Invalid email or password.")
    else:
        form = LoginForm()

    return render(request, "admin/login.html", {"form": form})

def logout_view(request):
    logout(request)
    return redirect(reverse('admin_login'))