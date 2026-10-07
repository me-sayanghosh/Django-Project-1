from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Tweet
from .serializers import TweetSerializer, UserSerializer


class TweetListCreateAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request):
        search_query = request.query_params.get('search', '').strip()
        tweets = Tweet.objects.all().order_by('-created_at')
        if search_query:
            from django.db.models import Q
            tweets = tweets.filter(Q(text__icontains=search_query) | Q(user__username__icontains=search_query))
        serializer = TweetSerializer(tweets, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TweetSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TweetDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_object(self, pk):
        return get_object_or_404(Tweet, pk=pk)

    def get(self, request, pk):
        tweet = self.get_object(pk)
        serializer = TweetSerializer(tweet, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        return self.patch(request, pk)

    def patch(self, request, pk):
        tweet = self.get_object(pk)
        if tweet.user != request.user:
            return Response({'error': 'You do not have permission to edit this tweet.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TweetSerializer(tweet, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        tweet = self.get_object(pk)
        if tweet.user != request.user:
            return Response({'error': 'You do not have permission to delete this tweet.'}, status=status.HTTP_403_FORBIDDEN)
        
        tweet.delete()
        return Response({'message': 'Tweet deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'A user with this username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)

        return Response({
            'token': token.key,
            'user': user_serializer.data,
            'message': 'Account created successfully.'
        }, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)

        return Response({
            'token': token.key,
            'user': user_serializer.data,
            'message': 'Signed in successfully.'
        }, status=status.HTTP_200_OK)


class CurrentUserAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
