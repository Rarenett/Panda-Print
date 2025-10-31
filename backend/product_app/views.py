from django.shortcuts import redirect, render,get_object_or_404
from product_app.forms import ProductCategoryForm,EmployeeForm,ProductCategory,ProductTypeForm,MaterialForm
from product_app.forms import CustomizationFieldForm,ProductImageForm, FieldOptionForm
from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from product_app.models import ProductCategory,ProductType,ProductImage,CustomizationField,Material, FieldOption
from helpers.export_utils import export_to_excel, export_to_pdf
from django.db.models import Q
from rest_framework.decorators import action
from .models import FlashSale, MostPopular
from .forms import FlashSaleForm, MostPopularForm
from rest_framework.response import Response
from rest_framework import viewsets
from .models import FlashSale, MostPopular
from .serializers import FlashSaleSerializer, MostPopularSerializer
# from rest_framework.decorators import api_view
# from .serializers import ProductCategorySerializer,ProductCategoryDetailSerializer,ProductTypeSerializer
from rest_framework.permissions import AllowAny  # Add this import
from django.utils import timezone
from datetime import timedelta
#passes data in json format after fetching, serializes to convert it into json, passes this json as response
import pytz

# @api_view(['GET'])
# def customer_get_categories(request):
#     categories = ProductCategory.objects.all().order_by('display_order')
#     serializer = ProductCategorySerializer(categories, many=True)
#     return Response(serializer.data)

# class ProductCategoryViewSet(viewsets.ModelViewSet):
#     queryset = ProductCategory.objects.all().order_by('display_order')
#     serializer_class = ProductCategorySerializer
#     permission_classes = [AllowAny]  # This allows unauthenticated access


# class ProductCategoryViewSet(viewsets.ModelViewSet):
#     queryset = ProductCategory.objects.all().order_by('display_order')
#     serializer_class = ProductCategorySerializer
#     permission_classes = [AllowAny]
#     lookup_field = 'slug'
    
#     def get_serializer_context(self):
#         return {'request': self.request}
    
#     @action(detail=True, methods=['get'])
#     def details(self, request, slug=None):
#         """Get category with all product types - /api/categories/{slug}/details/"""
#         category = self.get_object()
#         serializer = ProductCategoryDetailSerializer(category, context={'request': request})
#         return Response(serializer.data)


# class ProductTypeViewSet(viewsets.ModelViewSet):
#     queryset = ProductType.objects.all()
#     serializer_class = ProductTypeSerializer
#     permission_classes = [AllowAny]
    
#     def get_serializer_context(self):
#         return {'request': self.request}



from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import (
    ProductCategory, ProductType, Material, 
    CustomizationField, FieldOption, ProductImage
)
from .serializers import (
    ProductCategorySerializer, ProductTypeDetailSerializer,
    MaterialSerializer, CustomizationFieldSerializer,
    FieldOptionSerializer, ProductImageSerializer
)

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all().order_by('display_order')
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['get'])
    def details(self, request, slug=None):
        """Get category with all product types - /api/categories/{slug}/details/"""
        category = self.get_object()
        serializer = ProductCategorySerializer(category, context={'request': request})
        return Response(serializer.data)


class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeDetailSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['get'])
    def with_materials(self, request, pk=None):
        """Get product type with all materials, customization fields, and options"""
        product_type = self.get_object()
        serializer = ProductTypeDetailSerializer(product_type, context={'request': request})
        return Response(serializer.data)


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['get'])
    def with_customizations(self, request, pk=None):
        """Get material with customization fields, options, and images"""
        material = self.get_object()
        serializer = MaterialSerializer(material, context={'request': request})
        return Response(serializer.data)


class CustomizationFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomizationField.objects.all()
    serializer_class = CustomizationFieldSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['get'])
    def with_options(self, request, pk=None):
        """Get customization field with all its options"""
        field = self.get_object()
        serializer = CustomizationFieldSerializer(field, context={'request': request})
        return Response(serializer.data)


class FieldOptionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing field options"""
    queryset = FieldOption.objects.all()
    serializer_class = FieldOptionSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        """Optionally filter by field"""
        queryset = FieldOption.objects.all()
        field_id = self.request.query_params.get('field', None)
        if field_id is not None:
            queryset = queryset.filter(field_id=field_id)
        return queryset


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


class FlashSaleViewSet(viewsets.ModelViewSet):
    queryset = FlashSale.objects.all()
    serializer_class = FlashSaleSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def _get_current_ist_naive(self):
        """Get current time in IST as naive datetime for comparison"""
        current_utc = timezone.now()
        ist = pytz.timezone('Asia/Kolkata')
        current_ist = current_utc.astimezone(ist)
        return current_ist.replace(tzinfo=None)  # Remove timezone info
    
    def get_queryset(self):
        """Return only active flash sales, comparing with IST time"""
        current_ist_naive = self._get_current_ist_naive()
        
        queryset = FlashSale.objects.filter(
            is_active=True,
            start_time__lte=current_ist_naive,
            end_time__gte=current_ist_naive
        ).select_related('material', 'material__product_type').prefetch_related(
            'material__customizationfield_set',
            'material__productimage_set'
        ).order_by('display_order', '-start_time')
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active flash sales"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming flash sales"""
        current_ist_naive = self._get_current_ist_naive()
        
        queryset = FlashSale.objects.filter(
            is_active=True,
            start_time__gt=current_ist_naive
        ).select_related('material', 'material__product_type').prefetch_related(
            'material__customizationfield_set',
            'material__productimage_set'
        ).order_by('start_time')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get expired flash sales"""
        current_ist_naive = self._get_current_ist_naive()
        
        queryset = FlashSale.objects.filter(
            end_time__lt=current_ist_naive
        ).select_related('material', 'material__product_type').prefetch_related(
            'material__customizationfield_set',
            'material__productimage_set'
        ).order_by('-end_time')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def debug(self, request):
        """Debug endpoint to check dates"""
        current_utc = timezone.now()
        ist = pytz.timezone('Asia/Kolkata')
        current_ist = current_utc.astimezone(ist)
        current_ist_naive = current_ist.replace(tzinfo=None)
        
        all_sales = FlashSale.objects.all()
        
        debug_data = {
            'current_server_time_utc': str(current_utc),
            'current_time_ist_aware': str(current_ist),
            'current_time_ist_naive': str(current_ist_naive),
            'note': 'Database times are stored in IST format (naive)',
            'all_flash_sales': []
        }
        
        for sale in all_sales:
            is_started = sale.start_time <= current_ist_naive
            is_not_ended = sale.end_time >= current_ist_naive
            should_show = sale.is_active and is_started and is_not_ended
            
            debug_data['all_flash_sales'].append({
                'id': sale.id,
                'title': sale.sale_title,
                'start_time_db_ist': str(sale.start_time),
                'end_time_db_ist': str(sale.end_time),
                'is_active_flag': sale.is_active,
                'is_started': is_started,
                'is_not_ended': is_not_ended,
                'should_show': should_show,
                'comparison_details': {
                    'start_time': str(sale.start_time),
                    'current_time': str(current_ist_naive),
                    'end_time': str(sale.end_time),
                }
            })
        
        return Response(debug_data)
    
    
class MostPopularViewSet(viewsets.ModelViewSet):
    queryset = MostPopular.objects.all()
    serializer_class = MostPopularSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    def get_queryset(self):
        """Return most popular items ordered by display_order"""
        queryset = MostPopular.objects.select_related(
            'material', 
            'material__product_type'
        ).prefetch_related(
            'material__customizationfield_set',
            'material__productimage_set'
        ).order_by('display_order')
        
        # Optional filtering by product type
        product_type = self.request.query_params.get('product_type', None)
        if product_type:
            queryset = queryset.filter(material__product_type__id=product_type)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get most popular items grouped by product type"""
        product_type_id = request.query_params.get('product_type_id')
        
        if product_type_id:
            queryset = self.get_queryset().filter(material__product_type__id=product_type_id)
        else:
            queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get most popular items that have sale percentage"""
        queryset = self.get_queryset().filter(sale_percentage__gt=0)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
# Create your views here.
def add_product_category(request, id=None):
    # if pk exists → editing; otherwise → adding
    if id:
        category = get_object_or_404(ProductCategory, id=id)
    else:
        category = None

    if request.method == 'POST':
        form = ProductCategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            return redirect('category_listings') #use the url name here
    else:
        form = ProductCategoryForm(instance=category)

    return render(request, 'product/create_product.html', {'form': form})


def delete_category(request, id):
    category = get_object_or_404(ProductCategory, id=id)
    category.delete()
    return redirect('category_listings')


def category_list(request):
    # 🔍 Search
    search_query = request.GET.get('q', '').strip()
    categories = ProductCategory.objects.all().order_by('display_order')
    if search_query:
        categories = categories.filter(name__icontains=search_query)

    # 📄 Pagination
    paginator = Paginator(categories, 5)  # 5 items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # 📤 Export - Excel or PDF
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=categories,
            fields=['name', 'display_order'],
            filename='categories',
            sheet_name='Categories'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=categories,
            fields=['name', 'display_order'],
            filename='categories',
            title='Category Report',
            headers=['Category Name', 'Display Order']
        )


    return render(request, 'product/category_list.html', {
        'categories': page_obj,
        'search_query': search_query
    })


def product_type_list(request):
    # Get all categories for dropdown
    categories = ProductCategory.objects.all().order_by('name')
    
    # Get filter parameters
    search_query = request.GET.get('q', '').strip()
    selected_category = request.GET.get('category', '').strip()
    min_price = request.GET.get('min_price', '').strip()
    max_price = request.GET.get('max_price', '').strip()
    
    # Start with all product types
    product_types = ProductType.objects.select_related('category').all().order_by('name')
    
    # Apply search filter
    if search_query:
        product_types = product_types.filter(
            Q(name__icontains=search_query) |
            Q(category__name__icontains=search_query)
        )
    
    # Apply category filter
    if selected_category:
        product_types = product_types.filter(category_id=selected_category)
    
    # Apply price range filter
    if min_price:
        product_types = product_types.filter(base_unit_cost__gte=min_price)
    
    if max_price:
        product_types = product_types.filter(base_unit_cost__lte=max_price)

    # 📄 Pagination
    paginator = Paginator(product_types, 5)  # 5 items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # 📤 Export - Excel or PDF
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=product_types,
            fields=['name', 'category__name', 'base_unit_cost', 'is_custom_size'],
            filename='product_types',
            sheet_name='Product Types'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=product_types,
            fields=['name', 'category__name', 'base_unit_cost', 'is_custom_size'],
            filename='product_types',
            title='Product Types Report',
            headers=['Product Type', 'Category', 'Base Unit Cost', 'Custom Size']
        )

    return render(request, 'product/product_type_list.html', {
        'product_types': page_obj,
        'categories': categories,
        'search_query': search_query,
        'selected_category': selected_category,
        'min_price': min_price,
        'max_price': max_price,
    })


#product type

def add_edit_product_type(request, id=None):
    if id:
        producttype = get_object_or_404(ProductType, id=id)
    else:
        producttype = None
    
    if request.method == 'POST':
        # FIXED: Add request.FILES here
        form = ProductTypeForm(request.POST, request.FILES, instance=producttype)
        if form.is_valid():
            form.save()
            return redirect('product_listings')
    else:
        form = ProductTypeForm(instance=producttype)
    
    return render(request, 'product/product_type.html', {'form': form})


def delete_product_type(request, id):
    producttype = get_object_or_404(ProductType, id=id)
    producttype.delete()
    return redirect('product_listings')





#sample
def add_employee_details(request):
    if request.method == 'POST':
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('add_employee')  # Adjust to your view name
    else:
        form = EmployeeForm()

    return render(request, 'employee/add_employee.html', {'form': form})






# ==================== MATERIAL CRUD ====================
def material_list(request):
    search_query = request.GET.get('q', '').strip()
    selected_product_type = request.GET.get('product_type', '').strip()
    
    materials = Material.objects.select_related('product_type').all().order_by('name')
    
    # Apply filters
    if search_query:
        materials = materials.filter(
            Q(name__icontains=search_query) |
            Q(product_type__name__icontains=search_query)
        )
    
    if selected_product_type:
        materials = materials.filter(product_type_id=selected_product_type)
    
    # Pagination
    paginator = Paginator(materials, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Export - Excel or PDF
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=materials,
            fields=['name', 'product_type__name', 'material_cost_per_sqft'],
            filename='materials',
            sheet_name='Materials'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=materials,
            fields=['name', 'product_type__name', 'material_cost_per_sqft'],
            filename='materials',
            title='Materials Report',
            headers=['Material Name', 'Product Type', 'Cost per Sqft']
        )
    
    # Get all product types for filter dropdown
    from .models import ProductType
    product_types = ProductType.objects.all().order_by('name')
    
    return render(request, 'product/material_list.html', {
        'materials': page_obj,
        'product_types': product_types,
        'search_query': search_query,
        'selected_product_type': selected_product_type,
    })


def add_or_edit_material(request, id=None):
    material = get_object_or_404(Material, id=id) if id else None
    if request.method == 'POST':
        form = MaterialForm(request.POST, request.FILES, instance=material)
        if form.is_valid():
            form.save()
            return redirect('material_list')
    else:
        form = MaterialForm(instance=material)
    return render(request, 'product/add_material.html', {'form': form})


def delete_material(request, id):
    material = get_object_or_404(Material, id=id)
    material.delete()
    return redirect('material_list')


# ==================== CUSTOMIZATION FIELD CRUD ====================
def customization_list(request):
    search_query = request.GET.get('q', '').strip()
    selected_material = request.GET.get('material', '').strip()
    
    fields = CustomizationField.objects.select_related('material').all().order_by('display_order')
    
    # Apply filters
    if search_query:
        fields = fields.filter(
            Q(field_name__icontains=search_query) |
            Q(material__name__icontains=search_query)
        )
    
    if selected_material:
        fields = fields.filter(material_id=selected_material)
    
    # Pagination
    paginator = Paginator(fields, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Export - Excel or PDF
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=fields,
            fields=['field_name', 'material__name', 'field_type', 'is_required', 'display_order'],
            filename='customization_fields',
            sheet_name='Customization Fields'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=fields,
            fields=['field_name', 'material__name', 'field_type', 'is_required', 'display_order'],
            filename='customization_fields',
            title='Customization Fields Report',
            headers=['Field Name', 'Material', 'Field Type', 'Required', 'Display Order']
        )
    
    # Get all materials for filter dropdown
    materials = Material.objects.all().order_by('name')
    
    return render(request, 'product/customization_list.html', {
        'fields': page_obj,
        'materials': materials,
        'search_query': search_query,
        'selected_material': selected_material,
    })


def add_or_edit_customization(request, id=None):
    field = get_object_or_404(CustomizationField, id=id) if id else None
    if request.method == 'POST':
        form = CustomizationFieldForm(request.POST, instance=field)
        if form.is_valid():
            form.save()
            return redirect('customization_list')
    else:
        form = CustomizationFieldForm(instance=field)
    return render(request, 'product/add_customization.html', {'form': form})


def delete_customization(request, id):
    field = get_object_or_404(CustomizationField, id=id)
    field.delete()
    return redirect('customization_list')


# ==================== PRODUCT IMAGE CRUD ====================
def image_list(request):
    search_query = request.GET.get('q', '').strip()
    selected_material = request.GET.get('material', '').strip()
    selected_role = request.GET.get('role', '').strip()
    
    images = ProductImage.objects.select_related('material').all().order_by('display_order')
    
    # Apply filters
    if search_query:
        images = images.filter(
            Q(caption__icontains=search_query) |
            Q(material__name__icontains=search_query) |
            Q(role__icontains=search_query)
        )
    
    if selected_material:
        images = images.filter(material_id=selected_material)
    
    if selected_role:
        images = images.filter(role__icontains=selected_role)
    
    # Pagination
    paginator = Paginator(images, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Export - Excel or PDF
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=images,
            fields=['material__name', 'role', 'caption', 'display_order'],
            filename='product_images',
            sheet_name='Product Images'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=images,
            fields=['material__name', 'role', 'caption', 'display_order'],
            filename='product_images',
            title='Product Images Report',
            headers=['Material', 'Role', 'Caption', 'Display Order']
        )
    
    # Get all materials for filter dropdown
    materials = Material.objects.all().order_by('name')
    
    return render(request, 'product/image_list.html', {
        'images': page_obj,
        'materials': materials,
        'search_query': search_query,
        'selected_material': selected_material,
        'selected_role': selected_role,
    })


def add_or_edit_image(request, id=None):
    image = get_object_or_404(ProductImage, id=id) if id else None
    if request.method == 'POST':
        form = ProductImageForm(request.POST, request.FILES, instance=image)
        if form.is_valid():
            form.save()
            return redirect('image_list')
    else:
        form = ProductImageForm(instance=image)
    return render(request, 'product/add_image.html', {'form': form})


def delete_image(request, id):
    image = get_object_or_404(ProductImage, id=id)
    image.delete()
    return redirect('image_list')


def field_option_list(request):
    """
    Display list of field options with search, filter, pagination, and export features.
    """
    search_query = request.GET.get('q', '').strip()
    selected_field = request.GET.get('field', '').strip()
    
    # Get all field options
    options = FieldOption.objects.select_related('field').all().order_by('field', 'id')
    
    # Apply filters
    if search_query:
        options = options.filter(
            Q(value__icontains=search_query) |
            Q(field__field_name__icontains=search_query) |
            Q(field__field_type__icontains=search_query)
        )
    
    if selected_field:
        options = options.filter(field_id=selected_field)
    
    # Handle export requests before pagination
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=options,
            fields=['value', 'field__field_name', 'field__material__name', 'price_modifier_flat', 'price_modifier_percent'],
            filename='field_options',
            sheet_name='Field Options'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=options,
            fields=['value', 'field__field_name', 'field__material__name', 'price_modifier_flat', 'price_modifier_percent'],
            filename='field_options',
            title='Field Options Report',
            headers=['Option Value', 'Field Name', 'Material', 'Flat Price ($)', 'Percent Price (%)']
        )
    
    # Pagination
    paginator = Paginator(options, 10)  # 10 items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get all customization fields for filter dropdown
    fields = CustomizationField.objects.all().order_by('field_name')
    
    context = {
        'options': page_obj,
        'fields': fields,
        'search_query': search_query,
        'selected_field': selected_field,
    }
    
    return render(request, 'product/field_option_list.html', context)


def add_or_edit_field_option(request, id=None):
    """
    Add new or edit existing field option.
    """
    option = get_object_or_404(FieldOption, id=id) if id else None
    
    if request.method == 'POST':
        form = FieldOptionForm(request.POST, request.FILES, instance=option)
        if form.is_valid():
            form.save()
            return redirect('field_option_list')
    else:
        form = FieldOptionForm(instance=option)
    
    context = {
        'form': form,
        'option': option,
    }
    
    return render(request, 'product/add_field_option.html', context)


def delete_field_option(request, id):
    """
    Delete a field option.
    """
    option = get_object_or_404(FieldOption, id=id)
    option.delete()
    return redirect('field_option_list')



# 📦 FLASH SALE
def flash_sale_list(request):
    materials = Material.objects.all().order_by('name')
    search_query = request.GET.get('q', '').strip()
    selected_material = request.GET.get('material', '').strip()

    flash_sales = FlashSale.objects.select_related('material').all().order_by('-start_time')

    if search_query:
        flash_sales = flash_sales.filter(
            Q(material__name__icontains=search_query)
        )

    if selected_material:
        flash_sales = flash_sales.filter(material_id=selected_material)

    # Pagination
    paginator = Paginator(flash_sales, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Export PDF or Excel
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=flash_sales,
            fields=['material__name', 'discount_percentage', 'start_time', 'end_time'],
            filename='flash_sales',
            sheet_name='Flash Sales'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=flash_sales,
            fields=['material__name', 'discount_percentage', 'start_time', 'end_time'],
            filename='flash_sales',
            title='Flash Sales Report',
            headers=['Material', 'Discount %', 'Start Time', 'End Time']
        )

    return render(request, 'product/flash_sale_list.html', {
        'flash_sales': page_obj,
        'materials': materials,
        'search_query': search_query,
        'selected_material': selected_material,
    })


def add_edit_flash_sale(request, id=None):
    flash_sale = get_object_or_404(FlashSale, id=id) if id else None

    if request.method == 'POST':
        form = FlashSaleForm(request.POST, instance=flash_sale)
        if form.is_valid():
            form.save()
            return redirect('flash_sale_list')
    else:
        form = FlashSaleForm(instance=flash_sale)

        # Get all used material IDs
        used_material_ids = FlashSale.objects.values_list('material_id', flat=True)
        
        if flash_sale:
            # Include current material in the dropdown when editing
            used_material_ids = used_material_ids.exclude(id=flash_sale.material_id)
            form.fields['material'].queryset = Material.objects.filter(
                Q(id=flash_sale.material_id) | ~Q(id__in=used_material_ids)
            ).order_by('name')
        else:
            # New entry, exclude already-used materials
            form.fields['material'].queryset = Material.objects.exclude(id__in=used_material_ids).order_by('name')

    return render(request, 'product/flash_sale_form.html', {'form': form})


def delete_flash_sale(request, id):
    flash_sale = get_object_or_404(FlashSale, id=id)
    flash_sale.delete()
    return redirect('flash_sale_list')

def most_popular_list(request):
    materials = Material.objects.all().order_by('name')
    search_query = request.GET.get('q', '').strip()
    selected_material = request.GET.get('material', '').strip()

    # Fetch all most popular items
    most_popular = MostPopular.objects.select_related('material').all().order_by('display_order')

    # Filtering
    if search_query:
        most_popular = most_popular.filter(
            Q(material__name__icontains=search_query) |
            Q(badge__icontains=search_query) |
            Q(title__icontains=search_query)
        )

    if selected_material:
        most_popular = most_popular.filter(material_id=selected_material)

    # Pagination
    paginator = Paginator(most_popular, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Export PDF or Excel
    export_format = request.GET.get('export')
    if export_format == 'excel':
        return export_to_excel(
            queryset=most_popular,
            fields=['material__name', 'title', 'badge', 'sale_percentage', 'display_order'],
            filename='most_popular',
            sheet_name='Most Popular'
        )
    elif export_format == 'pdf':
        return export_to_pdf(
            queryset=most_popular,
            fields=['material__name', 'title', 'badge', 'sale_percentage', 'display_order'],
            filename='most_popular',
            title='Most Popular Materials Report',
            headers=['Material', 'Title', 'Badge', 'Sale %', 'Display Order']
        )

    return render(request, 'product/most_popular_list.html', {
        'most_popular': page_obj,
        'materials': materials,
        'search_query': search_query,
        'selected_material': selected_material,
    })


def add_edit_most_popular(request, id=None):
    popular = get_object_or_404(MostPopular, id=id) if id else None

    if request.method == 'POST':
        form = MostPopularForm(request.POST, instance=popular)
        if form.is_valid():
            form.save()
            return redirect('most_popular_list')
    else:
        form = MostPopularForm(instance=popular)

        # Get all used material IDs
        used_material_ids = MostPopular.objects.values_list('material_id', flat=True)
        
        if popular:
            # Remove the current material from exclusion so it stays visible in edit
            used_material_ids = used_material_ids.exclude(id=popular.material_id)
            form.fields['material'].queryset = Material.objects.filter(
                Q(id=popular.material_id) | ~Q(id__in=used_material_ids)
            ).order_by('name')
        else:
            # New entry, just exclude already-used materials
            form.fields['material'].queryset = Material.objects.exclude(id__in=used_material_ids).order_by('name')

    return render(request, 'product/most_popular_form.html', {'form': form})

 


def delete_most_popular(request, id):
    popular = get_object_or_404(MostPopular, id=id)
    popular.delete()
    return redirect('most_popular_list')
 
   