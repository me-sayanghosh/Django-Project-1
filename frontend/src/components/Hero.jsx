import React from 'react';
import { Rocket, Trophy, Sparkles, Gem, Coffee, Code, MessageSquare, Layout, Compass, Sun, Heart, Plus } from 'lucide-react';

export default function Hero({ user, tweetCount, onOpenCompose, onOpenAuth, onExploreFeed }) {
  return (
    <div className="relative rounded-[32px] border border-zinc-200/90 dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900/50 p-8 sm:p-14 md:p-20 text-center overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)] mb-16 transition-colors">
      
      {/* Faint Floating Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] dark:opacity-[0.08] select-none text-zinc-500 dark:text-zinc-400 overflow-hidden">
        <Rocket className="w-6 h-6 absolute top-8 left-14" />
        <Trophy className="w-6 h-6 absolute top-10 right-28" />
        <Sparkles className="w-6 h-6 absolute top-28 left-36" />
        <Gem className="w-6 h-6 absolute top-24 right-44" />
        <Coffee className="w-7 h-7 absolute bottom-14 left-20" />
        <Code className="w-6 h-6 absolute bottom-20 right-28" />
        <MessageSquare className="w-6 h-6 absolute bottom-8 left-1/3" />
        <Layout className="w-6 h-6 absolute top-16 left-1/2 -translate-x-1/2" />
        <Compass className="w-6 h-6 absolute bottom-10 right-1/3" />
        <Sun className="w-6 h-6 absolute top-36 right-16" />
        <Heart className="w-5 h-5 absolute bottom-36 left-12" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        
        {/* Main Hero Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-[60px] font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.08] transition-colors">
          Share Your Thoughts.<br />
          Connect Over Chai.
        </h1>

        {/* Subtitle Description */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal max-w-xl mx-auto leading-relaxed transition-colors">
          Join a friendly community of creators and friends. Share short updates, post photos, and discover interesting conversations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <button
              onClick={() => onOpenCompose()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black transition shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Post a Tweet
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('register')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black transition shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Get Started
            </button>
          )}

          <a
            href="#feed"
            onClick={(e) => {
              if (onExploreFeed) {
                e.preventDefault();
                onExploreFeed();
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
          >
            Explore Feed
          </a>
        </div>


      </div>
    </div>
  );
}
