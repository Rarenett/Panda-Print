from django.db import models
from django.utils.text import slugify
from datetime import timedelta

from admin_app.models import CustomUser
# Create your models here.
class ProductCategory(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while ProductCategory.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)







# 2. ProductType
class ProductType(models.Model):
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='product_types')
    name = models.CharField(max_length=255)
    base_unit_cost = models.DecimalField(max_digits=10, decimal_places=4)
    is_custom_size = models.BooleanField(default=False)
    image = models.ImageField(upload_to='product_types/', blank=True, null=True)

    def __str__(self):
        return self.name
    




#sample
class Employee(models.Model):
    name=models.CharField(max_length=255)
    age=models.IntegerField()








#material eg:vinyl banners
class Material(models.Model):
    name = models.CharField(
        max_length=100,
        help_text="Name of the material."
    )
    product_type=models.ForeignKey(ProductType, on_delete=models.CASCADE)
    image_swatch = models.ImageField(
        upload_to='swatches/',
        blank=True,
        null=True,
        help_text="Visual swatch for material selection."
    )
    material_cost_per_sqft = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        help_text="Raw material cost for pricing (per sqft)."
    )

    def __str__(self):
        return self.name
    # available_for = models.ManyToManyField(
    #     ProductType,
    #     related_name='materials',
    #     help_text="Which products can use this material."
    # )
   
    

#each feature inside material    
class CustomizationField(models.Model):
    # id = models.IntegerField(primary_key=True)                               # Unique record identifier. [cite: 18]
    material = models.ForeignKey(Material, on_delete=models.CASCADE)  # Product this field customizes. [cite: 18]
    field_name = models.CharField(max_length=100)                            # Label shown to the user. [cite: 18]
    field_type = models.CharField(max_length=50)                             # Hint for UI rendering (e.g., image cards). [cite: 18]
    is_required = models.BooleanField(default=False)                                      # Must a choice be selected? [cite: 18]
    display_order = models.IntegerField(default=0)                                    # Order on the configuration form. [cite: 18]

    class Meta:
        # Ensures that a product type doesn't have two customization fields with the same name
        unique_together = ('material', 'field_name')

    def __str__(self):
        return f"{self.material.name}: {self.field_name}"
    
    # product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)  # Product this field customizes. [cite: 18]


class ProductImage(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE,null=True)  # Product this image belongs to.
    image_file = models.ImageField(upload_to='gallery/',null=True)                     # The file path/name of the image.
    role = models.CharField(max_length=50,null=True)                                   # Function of the image (e.g., MAIN view).
    caption = models.CharField(max_length=255,null=True)                               # Alt text / descriptive text.
    display_order = models.IntegerField()                                    # Order in the carousel.

    class Meta:
        # Ensures that a product type doesn't have two images with the same role
        unique_together = ('material', 'role')


class FieldOption(models.Model):
    id = models.AutoField(primary_key=True)
    field = models.ForeignKey('CustomizationField', on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    image = models.ImageField(upload_to='field_options/', blank=True, null=True)
    price_modifier_flat = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_modifier_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    option_data = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.value


class ProductConfiguration(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, blank=True, null=True)
    product_type = models.ForeignKey('ProductType', on_delete=models.CASCADE)
    material = models.ForeignKey('Material', on_delete=models.CASCADE)
    width_inches = models.DecimalField(max_digits=6, decimal_places=2)
    height_inches = models.DecimalField(max_digits=6, decimal_places=2)
    config_details = models.JSONField()  # All user choices stored as JSON
    calculated_unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Config {self.id} - {self.product_type}"
    
#models flash sale and most popular
class FlashSale(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    sale_title = models.CharField(max_length=100, help_text="Title shown on the sale card.")
    discount_percentage = models.PositiveIntegerField(default=0, help_text="Discount percentage (e.g., 50 for 50%).")
    start_time = models.DateTimeField(help_text="Sale start time.")
    end_time = models.DateTimeField(help_text="Sale end time.")
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.sale_title} - {self.material.name}"

    @property
    def time_remaining(self):
        """Returns remaining time as timedelta if sale is active."""
        from django.utils import timezone
        if self.end_time > timezone.now():
            return self.end_time - timezone.now()
        return timedelta(0)


class MostPopular(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, help_text="Product title shown on card.")
    badge = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Optional label like 'Best Sale', 'Sale 50%', 'Top Rated', etc."
    )
    sale_percentage = models.PositiveIntegerField(default=0, help_text="Discount percentage if any.")
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} ({self.material.name})"