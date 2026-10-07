import React from 'react';
import { Search, Plus, Sun, Moon } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onOpenCompose, onLogout, theme, onToggleTheme }) {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs py-2 px-4 text-center border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-center gap-1.5 font-medium transition-colors">
        <span>✨ Welcome to Chai Tweet — share what's on your mind today</span>
        <a href="#feed" className="inline-flex items-center gap-1 text-zinc-950 dark:text-zinc-100 font-semibold hover:underline transition ml-1">
          Explore feed →
        </a>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-xs transition group-hover:scale-105">
                <span className="text-xs">●</span>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-zinc-950 dark:text-zinc-50">
                chai<span className="text-zinc-400 dark:text-zinc-500">.</span>tweet
              </span>
            </a>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <a href="#feed" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition">Feed</a>
              {user && (
                <button onClick={() => onOpenCompose()} className="hover:text-zinc-950 dark:hover:text-zinc-100 transition flex items-center gap-1 cursor-pointer">
                  New Tweet
                </button>
              )}
              <a href="#about" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition">About</a>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Search Mock Bar (Matches Screenshot) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-500 dark:text-zinc-400 w-44 lg:w-56 hover:border-zinc-300 dark:hover:border-zinc-700 transition">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="flex-1 font-normal">Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-xs text-zinc-500 dark:text-zinc-400">⌘ K</kbd>
            </div>

            {/* Sun / Moon Theme Toggle Icon */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-semibold">@{user.username}</span>
                </div>

                <button 
                  onClick={() => onOpenCompose()}
                  className="hidden sm:inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tweet
                </button>

                <button 
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-1.5 rounded-md text-xs font-semibold bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black transition shadow-xs cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            )}

          </div>
        </div>
      </header>
    </>
  );
}
