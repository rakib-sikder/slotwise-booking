"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError("Incorrect password");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <div className="mb-2">
          <LogoMark />
        </div>
        <h1 className="text-xl font-semibold">Owner login</h1>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full rounded-lg">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Demo password: <code className="rounded bg-muted px-1 py-0.5">demo1234</code> (or your{" "}
          <code className="rounded bg-muted px-1 py-0.5">OWNER_PASSWORD</code> env var)
        </p>
      </form>
    </div>
  );
}
