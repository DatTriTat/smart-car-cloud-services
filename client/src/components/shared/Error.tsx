interface ErrorProps {
  error: Error | null;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-sm text-rose-600">
        Failed to load {error?.message}
      </div>
    </div>
  );
}
