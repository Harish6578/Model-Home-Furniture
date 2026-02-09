from django.db import models

# Create your models here.
class Product(models.Model):
    title = models.CharField(max_length=255)
    desc = models.TextField(max_length=500)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    thumbnail = models.ImageField(upload_to='products/thumbnails/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title


from django.db import models
from django.core.validators import FileExtensionValidator

class ProductImage(models.Model):
    img = models.ImageField(
        upload_to='products/images/',
        blank=True,
        null=True
    )
    caption = models.CharField(max_length=200, blank=True)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_image(self):
        return bool(self.img)

    def __str__(self):
        return f"{self.product.title} media"

