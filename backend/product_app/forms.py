from django import forms
from .models import ProductCategory,ProductType,Employee,CustomizationField,Material,ProductImage, FieldOption
from .models import FlashSale, MostPopular

class ProductCategoryForm(forms.ModelForm):
    class Meta:
        model = ProductCategory
        fields = ['name','display_order']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'display_order': forms.NumberInput(attrs={'class': 'form-control'}),
        }



#sample


class EmployeeForm(forms.ModelForm):
    class Meta:
        model=Employee
        fields=['name','age']
        widgets={
            'name':forms.TextInput(attrs={'class': 'form-control'}),
            'age': forms.NumberInput(attrs={'class': 'form-control'}),
        }




class ProductTypeForm(forms.ModelForm):
    class Meta:
        model = ProductType
        fields = '__all__'
        widgets = {
            'category': forms.Select(attrs={'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'base_unit_cost': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_custom_size': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),  # NEW
        }
        labels = {
            'category': 'Category',
            'name': 'Product Type Name',
            'base_unit_cost': 'Base Unit Cost',
            'is_custom_size': 'Custom Size?',
            'image': 'Product Image',  # NEW
        }



class MaterialForm(forms.ModelForm):
    class Meta:
        model = Material
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'product_type': forms.Select(attrs={'class': 'form-control'}),
            'image_swatch': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
            'material_cost_per_sqft': forms.NumberInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'name': 'Material Name',
            'product_type': 'Product Type',
            'image_swatch': 'Swatch Image',
            'material_cost_per_sqft': 'Cost per Sqft',
        }

class CustomizationFieldForm(forms.ModelForm):
    class Meta:
        model = CustomizationField
        fields = '__all__'
        widgets = {
            'material': forms.Select(attrs={'class': 'form-control'}),
            'field_name': forms.TextInput(attrs={'class': 'form-control'}),
            'field_type': forms.TextInput(attrs={'class': 'form-control'}),
            'is_required': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'display_order': forms.NumberInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'field_type': 'Field Type(DROPDOWN/IMAGE_CARD)',
        }

class ProductImageForm(forms.ModelForm):
    class Meta:
        model = ProductImage
        fields = '__all__'
        widgets = {
            'material': forms.Select(attrs={'class': 'form-control'}),
            'image_file': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
            'role': forms.TextInput(attrs={'class': 'form-control'}),
            'caption': forms.TextInput(attrs={'class': 'form-control'}),
            'display_order': forms.NumberInput(attrs={'class': 'form-control'}),
        }

class FieldOptionForm(forms.ModelForm):
    class Meta:
        model = FieldOption
        fields = ['field', 'value', 'image', 'price_modifier_flat', 'price_modifier_percent', 'option_data']
        widgets = {
            'value': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter option value'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'price_modifier_flat': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'price_modifier_percent': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01'}),
            'option_data': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': '{"key": "value"}'}),
            'field': forms.Select(attrs={'class': 'form-control'}),
        }
        

class FlashSaleForm(forms.ModelForm):
    class Meta:
        model = FlashSale
        fields = '__all__'
        widgets = {
            'material': forms.Select(attrs={'class': 'form-control'}),
            'sale_title': forms.TextInput(attrs={'class': 'form-control'}),
            'discount_percentage': forms.NumberInput(attrs={'class': 'form-control'}),
            'start_time': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            'end_time': forms.DateTimeInput(attrs={'type': 'datetime-local', 'class': 'form-control'}),
            #'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'display_order': forms.NumberInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'material': 'Material',
            'sale_title': 'Sale Title',
            'discount_percentage': 'Discount (%)',
            'start_time': 'Start Time',
            'end_time': 'End Time',
           # 'is_active': 'Active?',
            'display_order': 'Display Order',
        }


class MostPopularForm(forms.ModelForm):
    class Meta:
        model = MostPopular
        fields = '__all__'
        widgets = {
            'material': forms.Select(attrs={'class': 'form-control'}),
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'badge': forms.TextInput(attrs={'class': 'form-control'}),
            'sale_percentage': forms.NumberInput(attrs={'class': 'form-control'}),
            'display_order': forms.NumberInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'material': 'Material',
            'title': 'Title',
            'badge': 'Badge Text',
            'sale_percentage': 'Discount (%)',
            'display_order': 'Display Order',
        }
        help_texts = {
            'badge': 'Enter text like “Top Pick”, “Trending”, or “Editor’s Choice”.',
        }