import { MapPin } from "lucide-react";

export function StudioMap({ address, city }: { address: string; city: string }) {
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl ring-1 ring-foreground/10">
      <div
        className="absolute inset-0 bg-muted"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan text-white shadow-[0_0_30px_-6px_var(--brand-violet)]">
          <MapPin className="size-5" />
        </span>
        <p className="text-sm font-medium">{address}</p>
        <p className="text-xs text-muted-foreground">{city}</p>
      </div>
    </div>
  );
}
