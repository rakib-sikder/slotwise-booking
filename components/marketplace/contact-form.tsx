"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const topics = [
  { value: "booking", label: "A booking question" },
  { value: "studio", label: "Listing my studio" },
  { value: "support", label: "Account support" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: "booking", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Fill in your name, email, and message first.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSent(true);
    toast.success("Message sent — we'll reply within a day.");
  };

  if (sent) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}>
          <CheckCircle2 className="size-12 text-brand-cyan" />
        </motion.div>
        <h2 className="font-heading text-xl font-medium">Message sent</h2>
        <p className="text-sm text-muted-foreground">Thanks, {form.name.split(" ")[0]} — we'll get back to you at {form.email} within a day.</p>
        <Button variant="outline" className="mt-2 rounded-full" onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "booking", message: "" }); }}>
          Send another message
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Casey" />
          </div>
          <div>
            <Label htmlFor="c-email">Email</Label>
            <Input id="c-email" type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jordan@email.com" />
          </div>
        </div>
        <div>
          <Label htmlFor="c-topic">What's this about?</Label>
          <Select value={form.topic} onValueChange={(v) => v && setForm({ ...form, topic: v })}>
            <SelectTrigger id="c-topic" className="mt-1.5 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="c-message">Message</Label>
          <Textarea id="c-message" className="mt-1.5 min-h-32" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-base text-white disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send message"}
        </Button>
      </form>
    </Card>
  );
}
