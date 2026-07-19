import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio-theme dark flex min-h-screen flex-col bg-background text-foreground">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster />
    </div>
  );
}
