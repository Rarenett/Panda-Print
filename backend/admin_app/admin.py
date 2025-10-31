from django.contrib import admin
from .models import CustomUser, Customer

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'is_staff', 'is_active', 'is_superuser']
    search_fields = ['email', 'name']
    list_filter = ['is_staff', 'is_active', 'is_superuser']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'dob', 'date_joined']
    search_fields = ['user__email', 'user__name', 'phone']
    list_filter = ['date_joined']
