'use client';
import { useCallback, useEffect, useState } from 'react';
import { Task } from '@/lib/types';

type Props = {
  tasks: Task[];
};

export default function MotivationalCard({ tasks }: Props) {
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPhrase = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/motivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tasks.map(t => ({
            title: t.title,
            priority: t.priority,
            status: t.status,
          })),
        }),
      });
      const { phrase } = await res.json() as { phrase: string };
      setPhrase(phrase);
    } catch {
      setPhrase('One step at a time — you\'ve got this.');
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0) fetchPhrase();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (tasks.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 p-px shadow-lg">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-200 mb-2">
              💡 Motivation
            </p>
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span className="text-white/60 text-sm">Generating…</span>
              </div>
            ) : (
              <p className="text-white font-semibold text-base leading-snug">
                {phrase}
              </p>
            )}
          </div>
          <button
            onClick={fetchPhrase}
            disabled={loading}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white disabled:opacity-40 active:scale-90 transition-transform hover:bg-white/30"
            aria-label="New phrase"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
