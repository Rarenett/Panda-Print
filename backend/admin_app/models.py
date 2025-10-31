from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
# Create your models here.

class Department(models.Model):
    department_name = models.CharField(max_length=100, null=False, unique=True)  # VARCHAR(100), not null
    description = models.TextField(null=True, blank=True)  # TEXT, optional

    def __str__(self):
        return self.department_name
    
class Designation(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='designations')
    name = models.CharField(max_length=100, null=False, blank=False)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.department.department_name})"

class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    contact_email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    image=models.ImageField(upload_to='company_logos/', null=True, blank=True)
    footer_name = models.CharField(max_length=255, null=True, blank=True)

    def _str_(self):
        return self.name

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# -----------------------------
# Custom User Manager
# -----------------------------
class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, name, password, **extra_fields)


# -----------------------------
# Custom User Model
# -----------------------------
class CustomUser(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email


# -----------------------------
# User Profile Model
# -----------------------------
class UserProfile(models.Model):
    user = models.OneToOneField(
        'admin_app.CustomUser',
        on_delete=models.CASCADE,
       
    )
    department = models.ForeignKey('admin_app.Department', on_delete=models.SET_NULL, null=True, blank=True)
    designation = models.ForeignKey('admin_app.Designation', on_delete=models.SET_NULL, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.name} ({self.user.email})"

# --------------------------
# Customer Profile Model
# --------------------------
class Customer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="customer_profile")
    phone = models.CharField(max_length=15, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/", blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.user.name


class Menu(models.Model):
    name = models.CharField(max_length=100,null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name


class SubMenu(models.Model):
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='submenus',null=True)
    name = models.CharField(max_length=100,null=True)
    url = models.CharField(max_length=255,null=True)

    def __str__(self):
        return f"{self.menu.name} - {self.name}"


class MenuPermission(models.Model):
    user_profile = models.ForeignKey("UserProfile", on_delete=models.CASCADE)
    submenu = models.ForeignKey("SubMenu", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user_profile", "submenu")

    def __str__(self):
        return f"{self.user_profile.user.email} → {self.submenu}"