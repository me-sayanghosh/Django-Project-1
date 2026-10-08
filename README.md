# chaiTweet 🍵

A full-stack Twitter/X-like micro-blogging application built with **Django** (backend) and **React + Vite** (frontend). Users can register, log in, post tweets with optional photos, edit and delete their own tweets, and search across all posts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 4.2, Django REST Framework |
| Auth | Token Authentication + Django session auth |
| Database | SQLite (dev) |
| Media | Pillow (image uploads) |
| CORS | django-cors-headers |
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Linting | Oxlint |

---

## Project Structure

```
Django Project 1/
├── chaiCoffie/               # Django project root
│   ├── chaiCoffie/           # Project settings, URLs, WSGI/ASGI
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── tweet/                # Core app
│   │   ├── models.py         # Tweet model
│   │   ├── views.py          # Template-rendered views
│   │   ├── api_views.py      # REST API views (APIView)
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # HTML route URLs
│   │   ├── api_urls.py       # REST API URLs (/api/...)
│   │   ├── forms.py          # Django forms
│   │   └── admin.py
│   ├── templates/            # Django HTML templates
│   │   ├── layout.html
│   │   ├── tweet_list.html
│   │   ├── tweet_form.html
│   │   ├── tweet_confirm_delete.html
│   │   └── registration/     # Login / register / logout pages
│   ├── static/               # Static files (CSS, JS)
│   ├── media/                # Uploaded photos (git-ignored)
│   └── manage.py
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx  # Login / Register modal
│   │   │   ├── Hero.jsx       # Landing hero section
│   │   │   ├── Navbar.jsx     # Top navigation bar
│   │   │   ├── TweetCard.jsx  # Individual tweet display
│   │   │   └── TweetModal.jsx # Create / edit tweet modal
│   │   ├── api.js            # Axios API client & helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── requirements.txt
└── .gitignore
```

---

## REST API Reference

Base URL: `http://127.0.0.1:8000/api/`

### Tweets

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/tweets/` | No | List all tweets (supports `?search=`) |
| `POST` | `/api/tweets/` | ✅ Yes | Create a new tweet |
| `GET` | `/api/tweets/<id>/` | No | Retrieve a single tweet |
| `PATCH` / `PUT` | `/api/tweets/<id>/` | ✅ Yes (owner) | Update a tweet |
| `DELETE` | `/api/tweets/<id>/` | ✅ Yes (owner) | Delete a tweet |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register a new user, returns token |
| `POST` | `/api/auth/login/` | Log in, returns token |
| `GET` | `/api/auth/user/` | Get the currently authenticated user |

> **Token Authentication**: Include the token in the `Authorization` header as `Token <your_token>`.

### Tweet Object

```json
{
  "id": 1,
  "user": { "id": 1, "username": "alice", "email": "alice@example.com" },
  "text": "Hello, chaiTweet! 🍵",
  "photo": null,
  "photo_url": null,
  "created_at": "2026-10-07T14:00:00Z",
  "updated_at": "2026-10-07T14:00:00Z"
}
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+

---

### Backend Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd "Django Project 1"

# 2. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Run database migrations
cd chaiCoffie
python manage.py migrate

# 5. Create a superuser (optional, for Django admin)
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

The Django backend will be available at `http://127.0.0.1:8000`.

---

### Frontend Setup

```bash
# From the project root
cd frontend

# Install Node dependencies
npm install

# Start the Vite dev server
npm run dev
```

The React frontend will be available at `http://localhost:5173`.

---

## Django Template UI

A classic server-rendered interface is also available directly via the Django backend:

| URL | Description |
|---|---|
| `/tweet/` | Tweet feed with search |
| `/tweet/create/` | Create a new tweet |
| `/tweet/<id>/edit/` | Edit a tweet |
| `/tweet/<id>/delete/` | Delete a tweet |
| `/tweet/register/` | Register a new account |
| `/accounts/login/` | Log in |
| `/accounts/logout/` | Log out |
| `/admin/` | Django admin panel |

---

## Environment Notes

- **CORS**: The backend is configured to allow requests from `http://localhost:5173` and `http://127.0.0.1:5173` (Vite dev server).
- **Media files**: Uploaded images are stored in `chaiCoffie/media/photos/` and served at `/media/`.
- **Database**: SQLite is used by default. To use PostgreSQL or another database, update the `DATABASES` setting in `chaiCoffie/chaiCoffie/settings.py`.
- **Secret Key**: The `SECRET_KEY` in `settings.py` is for development only. **Never commit a real secret key to version control.**

---

## Available Scripts

### Backend

```bash
python manage.py runserver       # Start dev server
python manage.py migrate         # Apply migrations
python manage.py makemigrations  # Create new migrations
python manage.py createsuperuser # Create admin user
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run Oxlint
```
