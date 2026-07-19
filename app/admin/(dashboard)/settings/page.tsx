"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import type { Service } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: "", durationMinutes: "30", price: "0" });
  const [bufferMinutes, setBufferMinutes] = useState("0");

  const refresh = () => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/settings").then((r) => r.json()).then((s) => setBufferMinutes(String(s.bufferMinutes)));
  };

  useEffect(refresh, []);

  const saveBuffer = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bufferMinutes: Number(bufferMinutes) }),
    });
    toast.success("Buffer time saved");
  };

  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name) return;
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newService.name,
        durationMinutes: Number(newService.durationMinutes),
        price: Number(newService.price),
      }),
    });
    setNewService({ name: "", durationMinutes: "30", price: "0" });
    toast.success("Service added");
    refresh();
  };

  const removeService = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    toast.success("Service removed");
    refresh();
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <header>
        <p className="text-sm text-muted-foreground">Settings</p>
        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
        <p className="text-sm text-muted-foreground mt-1">What clients can book, and how long each takes.</p>
      </header>

      <Card className="p-5 space-y-2">
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm">
            <span>
              {s.name} · {s.durationMinutes}min · ${s.price}
            </span>
            <button onClick={() => removeService(s.id)} className="text-destructive hover:underline flex items-center gap-1">
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </div>
        ))}
        {services.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
      </Card>

      <Card className="p-5">
        <h2 className="font-medium mb-3 text-sm">Add a service</h2>
        <form onSubmit={addService} className="flex flex-wrap gap-2">
          <Input
            placeholder="Service name"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            className="flex-1 min-w-[140px]"
          />
          <Input
            type="number"
            min={5}
            placeholder="Minutes"
            value={newService.durationMinutes}
            onChange={(e) => setNewService({ ...newService, durationMinutes: e.target.value })}
            className="w-24"
          />
          <Input
            type="number"
            min={0}
            placeholder="Price $"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            className="w-24"
          />
          <Button type="submit" className="rounded-lg">
            Add
          </Button>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="font-medium mb-1">Buffer time</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Minutes of breathing room to keep open before and after every booking, so back-to-back
          clients never run into each other.
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            step={5}
            value={bufferMinutes}
            onChange={(e) => setBufferMinutes(e.target.value)}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">minutes</span>
          <Button variant="outline" className="rounded-lg ml-2" onClick={saveBuffer}>
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
}
