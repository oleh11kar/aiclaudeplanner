'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioRecorder from '@/components/capture/AudioRecorder';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { addTasks } from '@/lib/storage';
import { Task } from '@/lib/types';

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function CapturePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const router = useRouter();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }

  async function processText() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/process-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
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

  async function handleAudioReady(blob: Blob) {
    setLoading(true);
    try {
      const audio = await blobToBase64(blob);
      const body = text.trim() ? { text, audio } : { audio };
      const res = await fetch('/api/process-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Capture</p>

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
          onClick={processText}
          disabled={loading}
          className="mt-4 w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg disabled:opacity-50 active:scale-95 transition-transform"
        >
          Process
        </button>
      )}

      <div className="mt-6 flex justify-center">
        <AudioRecorder
          onAudioReady={handleAudioReady}
          onTranscriptUpdate={t => setText(t)}
          disabled={loading}
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
