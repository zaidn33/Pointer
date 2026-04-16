"use client";

import { useState } from "react";

type Item = {
  title: string;
  body: string;
};

const items: Item[] = [
  {
    title: "No bank logins, ever",
    body:
      "Pointer never asks for bank usernames, passwords, card numbers, or CVVs. We don't connect to bank accounts and we don't use financial aggregation APIs.",
  },
  {
    title: "You only tell us what you have",
    body:
      "Add the cards in your wallet. That's all the data Pointer needs to recommend the right card for groceries, gas, dining, or a flight.",
  },
  {
    title: "Recommendations grounded in real rules",
    body:
      "Structured card data is the source of truth. LLMs help interpret your question, but the ranking is always grounded in earn rates, multipliers, and active offers.",
  },
  {
    title: "Auditable admin and logging",
    body:
      "Card rules, merchant aliases, and offers are versioned. Every recommendation, detected merchant, and chosen card is logged so we can keep the engine honest.",
  },
];

export default function SecurityAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, idx) => {
        const isOpen = open === idx;
        return (
          <button
            key={item.title}
            type="button"
            onClick={() => setOpen(isOpen ? null : idx)}
            className="block w-full text-left py-6 group"
          >
            <div className="flex items-start gap-6">
              <span className="font-mono text-xs text-paper/50 mt-1.5">
                0{idx + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-xl text-paper">
                    {item.title}
                  </span>
                  <span
                    className={`text-paper/60 text-2xl transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </div>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-paper/70 max-w-2xl leading-relaxed text-[15px]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
