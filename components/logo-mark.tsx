export function LogoMark({ className = "text-lg" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
      </span>
      Slotwise
    </span>
  );
}
