from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tweet


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class TweetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'user', 'text', 'photo', 'photo_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None
