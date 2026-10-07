import React, { useState, useEffect } from 'react';
import { X, Image, Check, Send } from 'lucide-react';

export default function TweetModal({ isOpen, onClose, onSubmit, initialTweet = null }) {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTweet) {
      setText(initialTweet.text || '');
      setPhotoPreview(initialTweet.photo_url || initialTweet.photo || null);
    } else {
      setText('');
      setPhoto(null);
      setPhotoPreview(null);
    }
    setError('');
  }, [initialTweet, isOpen]);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Tweet text cannot be empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('text', text);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await onSubmit(formData, initialTweet?.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save tweet. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Mac Window Header */}
        <div className="px-5 py-3 bg-[#fbfbfb] dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"></span>
          </div>
          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
            {initialTweet ? 'compose/edit' : 'compose/new'}
          </span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
              {initialTweet ? 'Edit Tweet' : 'Create a Tweet'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Share your update with the community. Max 240 characters.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300 font-medium">
              {error}
            </div>
          )}

          {/* Text Input */}
          <div className="space-y-1.5">
            <textarea
              rows={4}
              maxLength={240}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind? Sip some chai and share your thoughts..."
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-400 transition resize-none"
            />
            <div className="flex justify-end text-[11px] text-zinc-400 dark:text-zinc-500">
              {text.length}/240
            </div>
          </div>

          {/* Photo Preview & Input */}
          <div className="space-y-2">
            {photoPreview && (
              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 max-h-48 bg-zinc-50 dark:bg-zinc-950">
                <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/60 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition text-xs text-zinc-600 dark:text-zinc-300 font-medium">
              <Image className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <span>{photoPreview ? 'Change attached photo' : 'Attach an optional photo'}</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-semibold bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : initialTweet ? (
                <><Check className="w-3.5 h-3.5" /> Update Tweet</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Publish Tweet</>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
