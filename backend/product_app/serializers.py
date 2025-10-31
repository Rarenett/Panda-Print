# serializers.py

from rest_framework import serializers
from .models import (
    ProductType, Material, CustomizationField, 
    ProductImage, ProductCategory, FieldOption
)
from .models import FlashSale, MostPopular, Material, ProductType
from django.utils import timezone
import pytz
from datetime import timedelta
# ============= FIELD OPTION SERIALIZER =============
class FieldOptionSerializer(serializers.ModelSerializer):
    """Serializer for individual field options (dropdown choices)"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FieldOption
        fields = [
            'id', 'value', 'image', 'image_url',
            'price_modifier_flat', 'price_modifier_percent', 
            'option_data'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


# ============= PRODUCT IMAGE SERIALIZER =============
class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_file', 'image_url', 'role', 'caption', 'display_order']
    
    def get_image_url(self, obj):
        if obj.image_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_file.url)
            return obj.image_file.url
        return None


# ============= CUSTOMIZATION FIELD SERIALIZER =============
class CustomizationFieldSerializer(serializers.ModelSerializer):
    """Serializer for customization fields WITH their options"""
    options = FieldOptionSerializer(
        source='fieldoption_set',
        many=True,
        read_only=True
    )
    
    class Meta:
        model = CustomizationField
        fields = ['id', 'field_name', 'field_type', 'is_required', 'display_order', 'options']


# ============= MATERIAL SERIALIZER =============
class MaterialSerializer(serializers.ModelSerializer):
    customization_fields = CustomizationFieldSerializer(
        source='customizationfield_set', 
        many=True, 
        read_only=True
    )
    product_images = ProductImageSerializer(
        source='productimage_set', 
        many=True, 
        read_only=True
    )
    swatch_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Material
        fields = [
            'id', 'name', 'product_type', 'image_swatch', 
            'swatch_url', 'material_cost_per_sqft', 
            'customization_fields', 'product_images'
        ]
    
    def get_swatch_url(self, obj):
        if obj.image_swatch:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_swatch.url)
            return obj.image_swatch.url
        return None


# ============= PRODUCT TYPE SERIALIZER =============
class ProductTypeSerializer(serializers.ModelSerializer):
    materials = MaterialSerializer(
        source='material_set', 
        many=True, 
        read_only=True
    )
    category_name = serializers.CharField(
        source='category.name', 
        read_only=True
    )
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductType
        fields = [
            'id', 'name', 'category', 'category_name',
            'base_unit_cost', 'is_custom_size', 'image_url',
            'materials'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


# ============= PRODUCT TYPE DETAIL SERIALIZER =============
class ProductTypeDetailSerializer(serializers.ModelSerializer):
    materials = MaterialSerializer(
        source='material_set', 
        many=True, 
        read_only=True
    )
    category_name = serializers.CharField(
        source='category.name', 
        read_only=True
    )
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductType
        fields = [
            'id', 'name', 'category', 'category_name',
            'base_unit_cost', 'is_custom_size', 'image_url',
            'materials'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


# ============= PRODUCT CATEGORY SERIALIZER =============
class ProductCategorySerializer(serializers.ModelSerializer):
    product_types = ProductTypeSerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug', 'display_order', 'product_count', 'product_types']
    
    def get_product_count(self, obj):
        return obj.product_types.count()
    


# ============= FLASH SALE SERIALIZER =============
class FlashSaleSerializer(serializers.ModelSerializer):
    material_data = MaterialSerializer(source='material', read_only=True)
    time_remaining = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    hours_remaining = serializers.SerializerMethodField()
    minutes_remaining = serializers.SerializerMethodField()
    seconds_remaining = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = FlashSale
        fields = [
            'id', 'material', 'material_data', 'sale_title', 
            'discount_percentage', 'start_time', 'end_time',
            'is_active', 'display_order', 'time_remaining',
            'days_remaining', 'hours_remaining', 'minutes_remaining', 
            'seconds_remaining', 'is_expired'
        ]
    
    def _get_current_ist_naive(self):
        """Get current time in IST as naive datetime"""
        current_utc = timezone.now()
        ist = pytz.timezone('Asia/Kolkata')
        return current_utc.astimezone(ist).replace(tzinfo=None)
    
    def get_time_remaining(self, obj):
        """Returns time remaining in seconds"""
        current_ist_naive = self._get_current_ist_naive()
        
        # Database times are in IST (naive), so compare directly
        if obj.end_time > current_ist_naive:
            delta = obj.end_time - current_ist_naive
            return int(delta.total_seconds())
        return 0
    
    def get_is_expired(self, obj):
        """Check if sale has expired"""
        current_ist_naive = self._get_current_ist_naive()
        return obj.end_time <= current_ist_naive
    
    def get_days_remaining(self, obj):
        """Returns days remaining"""
        current_ist_naive = self._get_current_ist_naive()
        
        if obj.end_time > current_ist_naive:
            delta = obj.end_time - current_ist_naive
            return delta.days
        return 0
    
    def get_hours_remaining(self, obj):
        """Returns hours remaining"""
        current_ist_naive = self._get_current_ist_naive()
        
        if obj.end_time > current_ist_naive:
            delta = obj.end_time - current_ist_naive
            return (delta.seconds // 3600) % 24
        return 0
    
    def get_minutes_remaining(self, obj):
        """Returns minutes remaining"""
        current_ist_naive = self._get_current_ist_naive()
        
        if obj.end_time > current_ist_naive:
            delta = obj.end_time - current_ist_naive
            return (delta.seconds // 60) % 60
        return 0
    
    def get_seconds_remaining(self, obj):
        """Returns seconds remaining"""
        current_ist_naive = self._get_current_ist_naive()
        
        if obj.end_time > current_ist_naive:
            delta = obj.end_time - current_ist_naive
            return delta.seconds % 60
        return 0
    
    
# ============= MOST POPULAR SERIALIZER =============
class MostPopularSerializer(serializers.ModelSerializer):
    material_data = MaterialSerializer(source='material', read_only=True)
    badge_color = serializers.SerializerMethodField()
    
    class Meta:
        model = MostPopular
        fields = [
            'id', 'material', 'material_data', 'title', 
            'badge', 'badge_color', 'sale_percentage', 'display_order'
        ]
    
    def get_badge_color(self, obj):
        """Return appropriate badge color based on badge text"""
        if not obj.badge:
            return None
        
        badge_lower = obj.badge.lower()
        if 'best' in badge_lower:
            return 'info'  # bg-info-600
        elif 'sale' in badge_lower or '%' in badge_lower:
            return 'danger'  # bg-danger-600
        elif 'new' in badge_lower:
            return 'warning'  # bg-warning-600
        elif 'top' in badge_lower:
            return 'success'  # bg-success-600
        else:
            return 'primary'  # bg-primary-600