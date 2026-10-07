import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TweetCard from './components/TweetCard';
import TweetModal from './components/TweetModal';
import AuthModal from './components/AuthModal';
import { getTweets, createTweet, updateTweet, deleteTweet, getCurrentUser, logoutUser } from './api';
import { Plus, Coffee, Sparkles, Image, Lock } from 'lucide-react';

export default function App() {
  const [tweets, setTweets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Sync theme with <html> class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals state
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Load user & tweets on mount
  useEffect(() => {
    setUser(getCurrentUser());
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const data = await getTweets();
      setTweets(data);
    } catch (err) {
      console.error('Failed to load tweets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Page view state ('home' | 'feed')
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#feed') {
      return 'feed';
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#feed') {
        setCurrentView('feed');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'feed') {
      window.location.hash = 'feed';
    } else {
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCompose = (tweet = null) => {
    if (!user) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setEditingTweet(tweet);
    setIsTweetModalOpen(true);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const handleSaveTweet = async (formData, id) => {
    if (id) {
      await updateTweet(id, formData);
    } else {
      await createTweet(formData);
    }
    await fetchTweets();
  };

  const handleDeleteTweet = async (id) => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      try {
        await deleteTweet(id);
        setTweets(tweets.filter((t) => t.id !== id));
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete tweet');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen flex flex-col text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* Navbar */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenCompose={handleOpenCompose}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section - Hidden when on feed page */}
        {currentView === 'home' && (
          <Hero
            user={user}
            tweetCount={tweets.length}
            onOpenCompose={handleOpenCompose}
            onOpenAuth={handleOpenAuth}
            onExploreFeed={() => navigateTo('feed')}
          />
        )}

        {/* Feed Section */}
        <div id="feed" className="space-y-6 pt-4 mb-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white transition-colors">
              Recent Community Tweets
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto transition-colors">
              Fresh updates and stories from people around the community
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent"></div>
            </div>
          ) : tweets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {tweets.map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  currentUser={user}
                  onEdit={(t) => handleOpenCompose(t)}
                  onDelete={handleDeleteTweet}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-16 px-6 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xl mb-4 shadow-2xs">
                ☕
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No tweets published yet</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">Be the first to brew a fresh post for the community.</p>
              {user ? (
                <button
                  onClick={() => handleOpenCompose()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Create First Tweet
                </button>
              ) : (
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black transition shadow-sm cursor-pointer"
                >
                  Sign in to Post
                </button>
              )}
            </div>
          )}
        </div>

        {/* About Section */}
        <div id="about" className="border-t border-zinc-200/90 dark:border-zinc-800 pt-16 pb-12 space-y-12 transition-colors">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white transition-colors">
              About Chai Tweet
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto transition-colors">
              Chai Tweet is a distraction-free space to share your thoughts, stories, and photos with friends and creators across the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-lg mb-3">
                <Sparkles className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
              </div>
              <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-100">Express Yourself</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Share thoughts in quick, concise posts and engage with meaningful conversations anytime.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-lg mb-3">
                <Image className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
              </div>
              <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-100">Photo Sharing</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Bring your updates to life by uploading photos directly alongside your messages.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-lg mb-3">
                <Lock className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
              </div>
              <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-100">Safe & Personal</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Keep control over your content with personal account security and privacy controls.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 bg-white dark:bg-zinc-950 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">chai.tweet</span>
            <span>•</span>
            <span>A simple, modern microblogging space</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer ${currentView === 'home' ? 'font-semibold text-zinc-950 dark:text-zinc-100' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('feed')}
              className={`hover:text-zinc-900 dark:hover:text-zinc-100 transition cursor-pointer ${currentView === 'feed' ? 'font-semibold text-zinc-950 dark:text-zinc-100' : ''}`}
            >
              Feed
            </button>
            <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">About</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TweetModal
        isOpen={isTweetModalOpen}
        onClose={() => { setIsTweetModalOpen(false); setEditingTweet(null); }}
        onSubmit={handleSaveTweet}
        initialTweet={editingTweet}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(u) => setUser(u)}
      />

    </div>
  );
}
