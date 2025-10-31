from django.urls import path,include
from rest_framework.routers import DefaultRouter
from product_app import views

from .views import (
    ProductCategoryViewSet, ProductTypeViewSet,
    MaterialViewSet, CustomizationFieldViewSet,
    FieldOptionViewSet, ProductImageViewSet,FlashSaleViewSet, MostPopularViewSet
)

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet, basename='productcategory')
router.register(r'product-types', ProductTypeViewSet, basename='producttype')
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'customization-fields', CustomizationFieldViewSet, basename='customizationfield')
router.register(r'field-options', FieldOptionViewSet, basename='fieldoption')
router.register(r'product-images', ProductImageViewSet, basename='productimage')
router.register(r'flash-sales', FlashSaleViewSet, basename='flashsale')
router.register(r'most-popular', MostPopularViewSet, basename='mostpopular')
# urlpatterns += router.urls
urlpatterns = [
    path('api/', include(router.urls)),  # ✅ All API endpoints under /api/



 path('add-employee',views.add_employee_details, name='add_employee'),
 path('category_listings',views.category_list, name='category_listings'),
 path('product_listings',views.product_type_list, name='product_listings'),
 path('add-product-category',views.add_product_category, name='add_product_category'),



 path('categories/edit/<int:id>/', views.add_product_category, name='edit_category'),
 path('categories/delete/<int:id>/', views.delete_category, name='delete_category'),


path('add_product_type',views.add_edit_product_type, name='addproducttype'),
 path('product_type/edit/<int:id>/', views.add_edit_product_type, name='edit_product_type'),
 path('product_type/delete/<int:id>/', views.delete_product_type, name='delete_product_type'),


     # ==================== MATERIAL URLs ====================
    path('materials/', views.material_list, name='material_list'),
    path('materials/add/', views.add_or_edit_material, name='add_material'),
    path('materials/edit/<int:id>/', views.add_or_edit_material, name='edit_material'),
    path('materials/delete/<int:id>/', views.delete_material, name='delete_material'),
    
    # ==================== CUSTOMIZATION FIELD URLs ====================
    path('customization-fields/', views.customization_list, name='customization_list'),
    path('customization-fields/add/', views.add_or_edit_customization, name='add_customization'),
    path('customization-fields/edit/<int:id>/', views.add_or_edit_customization, name='edit_customization'),
    path('customization-fields/delete/<int:id>/', views.delete_customization, name='delete_customization'),
    
    # ==================== PRODUCT IMAGE URLs ====================
    path('product-images/', views.image_list, name='image_list'),
    path('product-images/add/', views.add_or_edit_image, name='add_image'),
    path('product-images/edit/<int:id>/', views.add_or_edit_image, name='edit_image'),
    path('product-images/delete/<int:id>/', views.delete_image, name='delete_image'),


    path('field-options/', views.field_option_list, name='field_option_list'),
    path('field-options/add/', views.add_or_edit_field_option, name='add_field_option'),
    path('field-options/edit/<int:id>/', views.add_or_edit_field_option, name='edit_field_option'),
    path('field-options/delete/<int:id>/', views.delete_field_option, name='delete_field_option'),

 #react paths, make sure the url gievn here matches the frontend jsx route
    # path('api/category_list/', views.customer_get_categories, name='get_categories'),


 # Flash Sale
    path('flash-sales/', views.flash_sale_list, name='flash_sale_list'),
    path('flash-sales/add/', views.add_edit_flash_sale, name='add_flash_sale'),
    path('flash-sales/edit/<int:id>/', views.add_edit_flash_sale, name='edit_flash_sale'),
    path('flash-sales/delete/<int:id>/', views.delete_flash_sale, name='delete_flash_sale'),

    # Most Popular
    path('most-popular/', views.most_popular_list, name='most_popular_list'),
    path('most-popular/add/', views.add_edit_most_popular, name='add_most_popular'),
    path('most-popular/edit/<int:id>/', views.add_edit_most_popular, name='edit_most_popular'),
    path('most-popular/delete/<int:id>/', views.delete_most_popular, name='delete_most_popular'),


]
