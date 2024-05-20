from django.urls import path
from .views import RegisterView, LoginView, CreateDrawingView, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('drawings/', CreateDrawingView.as_view(), name='create-drawing'),
    path('me/', UserDetailView.as_view(), name='user-detail'),
]
