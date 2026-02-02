from django.urls import path
from .views import homeView, aboutView

from .views import (
    CarouselImageCreateView,
    CarouselImageListView,
    CarouselImageUpdateView,
    CarouselImageDeleteView
)

urlpatterns = [
    path('', homeView, name = 'home_page'),
    path("about/", aboutView, name = 'about_page'),

    # carousel
    path('carousels/', CarouselImageListView.as_view(), name='carousel_list'),
    path('carousels/add/', CarouselImageCreateView.as_view(), name='carousel_add'),
    path('carousels/<int:pk>/edit/', CarouselImageUpdateView.as_view(), name='carousel_edit'),
    path('carousels/<int:pk>/delete/', CarouselImageDeleteView.as_view(), name='carousel_delete'),
]