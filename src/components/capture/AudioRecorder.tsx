'use client';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export type AudioRecorderHandle = {
  stop: () => void;
  isActive: () => boolean;
};

type Props = {
  onTranscriptUpdate: (text: string) => void;
  disabled?: boolean;
  lang?: string;
};

type RecordState = 'idle' | 'recording' | 'paused';

const AudioRecorder = forwardRef<AudioRecorderHandle, Props>(function AudioRecorder(
  { onTranscriptUpdate, disabled, lang = 'uk-UA' },
  ref
) {
  const [state, setState] = useState<RecordState>('idle');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    stop() {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.onstop = () => {
          mediaRecorder.current?.stream.getTracks().forEach(t => t.stop());
        };
        mediaRecorder.current.stop();
      }
      try { recognition.current?.stop(); } catch {}
      setState('idle');
    },
    isActive() {
      return state !== 'idle';
    },
  }));

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.current.start(100);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SR) {
      recognition.current = new SR();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = lang;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.current.onresult = (e: any) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        onTranscriptUpdate(transcript);
      };
      try { recognition.current.start(); } catch {}
    }
    setState('recording');
  }

  function pause() {
    mediaRecorder.current?.pause();
    try { recognition.current?.stop(); } catch {}
    setState('paused');
  }

  function resume() {
    mediaRecorder.current?.resume();
    try { recognition.current?.start(); } catch {}
    setState('recording');
  }

  if (state === 'idle') {
    return (
      <button
        onClick={startRecording}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg disabled:opacity-50 active:scale-95 transition-transform mx-auto"
        aria-label="Start recording"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {state === 'recording' && (
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500 text-sm font-medium">Recording…</span>
        </div>
      )}
      <div className="flex gap-4">
        {state === 'recording' ? (
          <button onClick={pause}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold min-h-[44px] active:scale-95 transition-transform">
            Pause
          </button>
        ) : (
          <button onClick={resume}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold min-h-[44px] active:scale-95 transition-transform">
            Resume
          </button>
        )}
      </div>
    </div>
  );
});

export default AudioRecorder;
