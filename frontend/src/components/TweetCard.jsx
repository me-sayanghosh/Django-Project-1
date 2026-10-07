import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export default function TweetCard({ tweet, currentUser, onEdit, onDelete }) {
  const isOwner = currentUser && tweet.user && currentUser.id === tweet.user.id;
  const initial = tweet.user?.username ? tweet.user.username.charAt(0).toUpperCase() : '?';

  const formattedDate = new Date(tweet.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  // Resolve photo URL (if photo_url or photo is provided)
  const imageUrl = tweet.photo_url || tweet.photo;

  return (
    <div className="group flex flex-col rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      
      {/* Mac Window Top Bar (Exact Screenshot Style) */}
      <div className="px-4 py-2.5 bg-[#fbfbfb] dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          post/{tweet.id}
        </span>
      </div>

      {/* Card Image */}
      {imageUrl && (
        <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
          <img
            src={imageUrl}
            alt="Tweet attachment"
            className="w-full h-48 object-cover group-hover:scale-101 transition duration-200"
          />
        </div>
      )}

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Author Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs">
                {initial}
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                  @{tweet.user?.username || 'user'}
                </div>
                <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  {formattedDate}
                </div>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              #chai
            </span>
          </div>

          {/* Tweet Text */}
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-line font-normal">
            {tweet.text}
          </p>
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(tweet)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onDelete(tweet.id)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
