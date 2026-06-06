'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioRecorder, { AudioRecorderHandle } from '@/components/capture/AudioRecorder';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { addTasks } from '@/lib/storage';
import { Task } from '@/lib/types';

const LANGS = [
  { code: 'uk-UA', label: '🇺🇦 UA' },
  { code: 'en-US', label: '🇬🇧 EN' },
];

export default function CapturePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [lang, setLang] = useState('uk-UA');
  const audioRef = useRef<AudioRecorderHandle>(null);
  const router = useRouter();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }

  async function handleReady() {
    if (!text.trim()) return;
    // Stop any active recording before processing
    audioRef.current?.stop();
    setLoading(true);
    try {
      const res = await fetch('/api/process-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });
      if (!res.ok) throw new Error('Failed');
      const { tasks } = await res.json() as { tasks: Task[] };
      addTasks(tasks);
      router.push('/inbox');
    } catch {
      setLoading(false);
      showToast('AI processing failed. Try again.');
    }
  }

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-24">
      {loading && <LoadingOverlay />}

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Capture</p>
        <div className="flex gap-1">
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-h-[36px]
                ${lang === l.code ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write or dictate everything on your mind…"
        className="flex-1 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40vh]"
        style={{ fontSize: '16px' }}
        disabled={loading}
      />

      {text.trim() && (
        <button
          onClick={handleReady}
          disabled={loading}
          className="mt-4 w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg disabled:opacity-50 active:scale-95 transition-transform"
        >
          Ready
        </button>
      )}

      <div className="mt-6 flex justify-center">
        <AudioRecorder
          ref={audioRef}
          onTranscriptUpdate={t => setText(t)}
          disabled={loading}
          lang={lang}
        />
      </div>

      {toast && (
        <div className="fixed bottom-20 left-4 right-4 bg-red-500 text-white text-center py-3 px-4 rounded-xl shadow-lg z-50 text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
