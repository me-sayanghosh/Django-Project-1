from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Tweet


class ChaiTweetTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='password123', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', password='password123', email='user2@example.com')
        self.tweet1 = Tweet.objects.create(user=self.user1, text='First chai tweet by user1')

    def test_tweet_str(self):
        self.assertEqual(str(self.tweet1), f'{self.user1.username} - {self.tweet1.text[:10]}')

    def test_tweet_list_view(self):
        response = self.client.get(reverse('tweet_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'First chai tweet by user1')
        self.assertContains(response, '@user1')

    def test_tweet_create_unauthenticated_redirect(self):
        response = self.client.get(reverse('tweet_create'))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith('/accounts/login/'))

    def test_tweet_create_authenticated(self):
        self.client.login(username='user1', password='password123')
        response = self.client.post(reverse('tweet_create'), {'text': 'Second chai tweet'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Tweet.objects.filter(text='Second chai tweet').count(), 1)
        tweet = Tweet.objects.get(text='Second chai tweet')
        self.assertEqual(tweet.user, self.user1)

    def test_tweet_edit_owner(self):
        self.client.login(username='user1', password='password123')
        response = self.client.post(reverse('tweet_edit', args=[self.tweet1.id]), {'text': 'Updated chai tweet'})
        self.assertEqual(response.status_code, 302)
        self.tweet1.refresh_from_db()
        self.assertEqual(self.tweet1.text, 'Updated chai tweet')

    def test_tweet_edit_non_owner_forbidden(self):
        self.client.login(username='user2', password='password123')
        response = self.client.post(reverse('tweet_edit', args=[self.tweet1.id]), {'text': 'Hacked tweet'})
        self.assertEqual(response.status_code, 404)

    def test_tweet_delete_owner(self):
        self.client.login(username='user1', password='password123')
        response = self.client.post(reverse('tweet_delete', args=[self.tweet1.id]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Tweet.objects.filter(id=self.tweet1.id).exists())

    def test_tweet_delete_non_owner_forbidden(self):
        self.client.login(username='user2', password='password123')
        response = self.client.post(reverse('tweet_delete', args=[self.tweet1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertTrue(Tweet.objects.filter(id=self.tweet1.id).exists())

    def test_user_registration(self):
        response = self.client.post(reverse('register'), {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'StrongP@ss123!',
            'password2': 'StrongP@ss123!',
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(User.objects.filter(username='newuser').exists())
