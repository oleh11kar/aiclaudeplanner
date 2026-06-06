'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Add all memes here. Filenames must exist in /public/
const MEMES = [
  '/michael.png',
  '/1.png',
  '/2.png',
  '/3.png',
];

type Props = {
  show: boolean;
  onDone: () => void;
};

export default function TaskCelebration({ show, onDone }: Props) {
  const [visible, setVisible] = useState(false);
  const [meme, setMeme] = useState(MEMES[0]);

  useEffect(() => {
    if (!show) return;
    // Pick a random meme each time
    setMeme(MEMES[Math.floor(Math.random() * MEMES.length)]);
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 3000);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={() => { setVisible(false); onDone(); }}
    >
      <div className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl animate-bounce-in">
        <Image
          src={meme}
          alt="Task done!"
          width={640}
          height={480}
          className="w-full h-auto object-cover"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
