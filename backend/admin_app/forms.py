from django import forms
from .models import Department,Designation,Company,CustomUser, Menu, SubMenu,UserProfile
from django.core.exceptions import ValidationError
class DepartmentsForm(forms.ModelForm):
    class Meta:
        model = Department
        fields = ['department_name', 'description']
        widgets = {
            'department_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Department Name'}),
            'description': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Short description'}),
        }


class DesignationForm(forms.ModelForm):
    class Meta:
        model = Designation
        fields = ['department', 'name', 'description']
        widgets = {
            'department': forms.Select(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter designation name'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Enter description'}),
        }

class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'description', 'logo','website','contact_email','phone_number','image','footer_name']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter company name'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Enter description'}),
            #'logo': forms.Select(attrs={'class': 'form-control'}),
            'website': forms.URLInput(attrs={'class': 'form-control'}),
            'contact_email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter contact email'}),
            'phone_number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter phone number'}),
            'footer_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter footer name'}),
        }

class UserForm(forms.ModelForm):
    # Extra fields from UserProfile
    department = forms.ModelChoiceField(
        queryset=Department.objects.all(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    designation = forms.ModelChoiceField(
        queryset=Designation.objects.all(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    phone = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Phone number'})
    )
    profile_picture = forms.ImageField(required=False)

    # Password fields (optional on edit)
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter password'}),
        required=False
    )
    password2 = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm password'}),
        required=False
    )

    class Meta:
        model = CustomUser
        fields = ["name", "email"]
        widgets = {
            "name": forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Full name'}),
            "email": forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email address'}),
        }

    def __init__(self, *args, **kwargs):
        # Grab profile if passed
        self.profile_instance = kwargs.pop("profile_instance", None)
        super().__init__(*args, **kwargs)

        # Pre-fill UserProfile fields if editing
        if self.profile_instance:
            self.fields["department"].initial = self.profile_instance.department
            self.fields["designation"].initial = self.profile_instance.designation
            self.fields["phone"].initial = self.profile_instance.phone
            self.fields["profile_picture"].initial = self.profile_instance.profile_picture

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get("password1")
        p2 = cleaned_data.get("password2")

        # Only validate password if user is creating or changing password
        if p1 or p2:
            if p1 != p2:
                raise ValidationError("Passwords do not match")
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)

        # Set password only if user entered one
        password = self.cleaned_data.get("password1")
        if password:
            user.set_password(password)

        if commit:
            user.save()
            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    "department": self.cleaned_data.get("department"),
                    "designation": self.cleaned_data.get("designation"),
                    "phone": self.cleaned_data.get("phone"),
                    "profile_picture": self.cleaned_data.get("profile_picture"),
                }
            )
        return user
class LoginForm(forms.Form):
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email Address',
            'required': True
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Password',
            'required': True
        })
    )

# ---------------- MENU FORM ----------------
class MenuForm(forms.ModelForm):
    class Meta:
        model = Menu
        fields = ['name', 'icon']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'icon': forms.TextInput(attrs={'class': 'form-control'}),
        }


# ---------------- SUBMENU FORM ----------------
class SubMenuForm(forms.ModelForm):
    class Meta:
        model = SubMenu
        fields = ['menu', 'name', 'url',]
        widgets = {
            'menu': forms.Select(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'url': forms.TextInput(attrs={'class': 'form-control'}),
        }




# class InternalEmailForm(forms.ModelForm):
#     sender = forms.ModelChoiceField(
#         queryset=CustomUser.objects.all(),
#         label="Your Name / Email",
#         empty_label="Select"
#     )

#     recipient = forms.ModelChoiceField(
#         queryset=CustomUser.objects.all(),
#         label="Recipient",
#         empty_label="Select Recipient"
#     )

#     class Meta:
#         model = InternalEmail
#         fields = ['sender', 'recipient', 'subject', 'message']
#         widgets = {
#             'subject': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter subject'}),
#             'message': forms.Textarea(attrs={'class': 'form-control', 'rows': 6, 'placeholder': 'Type your message'}),
#         }

#     # Override init to customize recipient labels
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.fields['recipient'].label_from_instance = lambda obj: f"{obj.name} ({obj.email}) - {obj.userprofile.designation}"

########################################################################################


# admin/forms.py
# from django import forms
# from .models import Email
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class EmailForm(forms.ModelForm):
#     recipient = forms.ModelChoiceField(
#         queryset=User.objects.none(),
#         label="To",
#         widget=forms.Select(attrs={'class': 'form-select'})
#     )

#     class Meta:
#         model = Email
#         fields = ['recipient', 'subject', 'message', 'attachment']
#         widgets = {
#             'subject': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Subject'}),
#             'message': forms.Textarea(attrs={'class': 'form-control', 'rows': 6, 'placeholder': 'Write your message...'}),
#             'attachment': forms.ClearableFileInput(attrs={'class': 'form-control'}),
#         }

#     def __init__(self, *args, **kwargs):
#         user = kwargs.pop('user', None)
#         super().__init__(*args, **kwargs)
#         qs = User.objects.all()
#         if user:
#             qs = qs.exclude(pk=user.pk)
#         self.fields['recipient'].queryset = qs
