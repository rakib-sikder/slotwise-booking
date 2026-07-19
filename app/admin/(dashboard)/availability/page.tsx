"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

import type { WorkingHours } from "@/lib/types";
import { DAY_NAMES } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AvailabilityPage() {
  const [hours, setHours] = useState<WorkingHours>({});
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch("/api/hours").then((r) => r.json()).then(setHours);
  }, []);

  const updateDay = (day: number, field: "start" | "end", value: string) => {
    setHours((prev) => {
      const ranges = prev[day]?.length ? [...prev[day]] : [{ start: "09:00", end: "17:00" }];
      ranges[0] = { ...ranges[0], [field]: value };
      return { ...prev, [day]: ranges };
    });
  };

  const toggleDay = (day: number, open: boolean) => {
    setHours((prev) => ({ ...prev, [day]: open ? [{ start: "09:00", end: "17:00" }] : [] }));
  };

  const saveHours = async () => {
    if (saveBtnRef.current) {
      animate(saveBtnRef.current, { scale: [1, 0.92, 1], duration: 250, ease: "outQuad" });
    }
    await fetch("/api/hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hours),
    });
    toast.success("Working hours saved");
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <header>
        <p className="text-sm text-muted-foreground">Availability</p>
        <h1 className="text-2xl font-semibold tracking-tight">Working hours</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Only these windows are ever offered to clients on the booking page.
        </p>
      </header>

      <Card className="p-5">
        <div className="space-y-3">
          {DAY_NAMES.map((name, day) => {
            const open = (hours[day]?.length ?? 0) > 0;
            const range = hours[day]?.[0];
            return (
              <div key={day} className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-2.5 w-36">
                  <Switch checked={open} onCheckedChange={(checked) => toggleDay(day, checked)} />
                  {name}
                </label>
                {open && range ? (
                  <>
                    <Input
                      type="time"
                      value={range.start}
                      onChange={(e) => updateDay(day, "start", e.target.value)}
                      className="w-auto"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={range.end}
                      onChange={(e) => updateDay(day, "end", e.target.value)}
                      className="w-auto"
                    />
                  </>
                ) : (
                  <span className="text-muted-foreground text-xs">Closed</span>
                )}
              </div>
            );
          })}
        </div>
        <Button ref={saveBtnRef} onClick={saveHours} className="mt-5 rounded-lg w-fit">
          Save hours
        </Button>
      </Card>
    </div>
  );
}
