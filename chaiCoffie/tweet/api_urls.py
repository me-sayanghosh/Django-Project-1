from django.urls import path
from .api_views import (
    TweetListCreateAPIView,
    TweetDetailAPIView,
    RegisterAPIView,
    LoginAPIView,
    CurrentUserAPIView
)

urlpatterns = [
    path('tweets/', TweetListCreateAPIView.as_view(), name='api_tweet_list_create'),
    path('tweets/<int:pk>/', TweetDetailAPIView.as_view(), name='api_tweet_detail'),
    path('auth/register/', RegisterAPIView.as_view(), name='api_register'),
    path('auth/login/', LoginAPIView.as_view(), name='api_login'),
    path('auth/user/', CurrentUserAPIView.as_view(), name='api_current_user'),
]
