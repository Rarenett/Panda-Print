
from django.urls import path, include
from admin_app import views
from rest_framework.routers import DefaultRouter
from django.views.generic import TemplateView
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'register', views.RegisterViewSet, basename='register')
router.register(r'login', views.LoginViewSet, basename='login')


urlpatterns = [
    path('', TemplateView.as_view(template_name='react/index.html'), name='react_app'),

    # API endpoints
    # API endpoints
    path('api/', include(router.urls)),
    path('admin',views.admin_dashboard, name='admin_dashboard'),


    path('api/profile/', views.profile_view, name='profile'),
    
    
    path('add_department/', views.add_department, name='add_department'),
    path('department_list/', views.department_list, name='department_list'),
    path('edit_department/<int:pk>/', views.edit_department, name='edit_department'),
    path('delete_department/<int:id>/', views.delete_department, name='delete_department'),
    
    
    path('menus/', views.menu_list, name='menu_list'),
    path('menus/add/', views.add_menu, name='add_menu'),
    path('menus/edit/<int:pk>/', views.edit_menu, name='edit_menu'),
    path('menus/delete/<int:pk>/', views.delete_menu, name='delete_menu'),

    # SUBMENU
    path('submenus/', views.submenu_list, name='submenu_list'),
    path('submenus/add/', views.add_submenu, name='add_submenu'),
    path('submenus/edit/<int:pk>/', views.edit_submenu, name='edit_submenu'),
    path('submenus/delete/<int:pk>/', views.delete_submenu, name='delete_submenu'),
    
    path('users/<int:user_id>/submenu-permissions/', views.assign_submenu_permissions, name='assign_submenu_permissions'),

    # Designation
    path('add_designation/', views.add_designation, name='add_designation'),
    path('designation_list/', views.designation_list, name='designation_list'),
    path('edit_designation/<int:pk>/', views.edit_designation, name='edit_designation'),
    path('delete_designation/<int:id>/', views.delete_designation, name='delete_designation'),

    path('departments/', views.department_hierarchy, name='department_hierarchy'),

    #company profile
    path('add_company/', views.add_company, name='add_company'),
    path('company_list/', views.company_list, name='company_list'),
    path('edit_company/<int:pk>', views.edit_company, name='edit_company'),
    path('delete_company/<int:id>/', views.delete_company, name='delete_company'),

    #user registration
    path('register_user/', views.register_user, name='register_user'),
    path('user_list/', views.user_list, name='user_list'),
    path('delete_user/<int:id>/', views.delete_user, name='delete_user'),
    path('edit_user/<int:pk>/', views.edit_user, name='edit_user'),

    # login & logout
    path('', views.login_view, name='admin_login'),
    path('logout/',views.logout_view,name='logout'),

]







