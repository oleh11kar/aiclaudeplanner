'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Props = {
  show: boolean;
  onDone: () => void;
};

export default function TaskCelebration({ show, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 2000);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)' }}
    >
      <div className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl animate-bounce-in">
        <Image
          src="/michael.jpg"
          alt="Great job!"
          width={640}
          height={480}
          className="w-full h-auto object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-4 px-5">
          <p className="text-white font-black text-2xl text-center">Task done! 🤝</p>
        </div>
      </div>
    </div>
  );
}
