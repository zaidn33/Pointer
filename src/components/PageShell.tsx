import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function PageShell({
  eyebrow,
  title,
  italic,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <SiteHeader variant="app" />
      <main className="flex-1">
        <section className="border-b border-line-soft">
          <div className="mx-auto max-w-7xl px-6 md:px-10 py-14">
            <p className="eyebrow">{eyebrow}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
              <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">
                {title}{" "}
                {italic && <span className="italic">{italic}</span>}
              </h1>
              {actions}
            </div>
            {description && (
              <p className="mt-4 max-w-2xl text-ink-soft text-lg">
                {description}
              </p>
            )}
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-12">
          {children}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
