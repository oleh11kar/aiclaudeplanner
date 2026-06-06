export default function LoadingOverlay({ message = 'Processing…' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-white border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-white font-medium text-lg">{message}</p>
    </div>
  );
}
