import Link from "next/link";

import { LogoMark } from "@/components/logo-mark";

const socials = ["IG", "X", "YT"];

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/studios", label: "All studios" },
      { href: "/studios?category=photo", label: "Photography" },
      { href: "/studios?category=podcast", label: "Podcast" },
      { href: "/studios?category=video", label: "Video" },
      { href: "/studios?category=music", label: "Music" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/admin", label: "Studio owner login" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Help center" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <LogoMark />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Book creative spaces that inspire — photography, podcast, video, and music studios,
              all in one place.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((label) => (
                <span
                  key={label}
                  className="flex size-8 items-center justify-center rounded-full border border-border text-[11px] font-medium text-muted-foreground transition-colors hover:border-brand-violet/50 hover:text-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Slotwise. All rights reserved.</p>
          <p>Made for creators, by creators.</p>
        </div>
      </div>
    </footer>
  );
}
