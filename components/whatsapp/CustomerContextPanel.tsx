import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { RelatedContext } from "@/lib/whatsapp/types";
import { NoLinkedTrip } from "./EmptyStates";

export function CustomerContextPanel({ context }: { context?: RelatedContext[] }) {
  if (!context || context.length === 0) {
    return (
      <div className="w-80 border-l border-[#222] bg-[#0A0A0A] p-6 hidden lg:block">
        <h3 className="font-display text-lg mb-4">Context</h3>
        <NoLinkedTrip />
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-[#222] bg-[#0A0A0A] p-6 hidden lg:block">
      <h3 className="font-display text-lg mb-4">Context</h3>
      <div className="space-y-4">
        {context.map((ctx) => (
          <div key={ctx.id} className="border border-[#222] bg-[#111] rounded-lg p-4">
            <div className="text-xs text-[#888] uppercase tracking-wider mb-1">{ctx.type}</div>
            <div className="font-medium text-sm mb-3">{ctx.label}</div>
            {ctx.meta && (
              <div className="space-y-1 mb-3 text-xs text-[#ccc]">
                {Object.entries(ctx.meta).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[#888] capitalize">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}
            <Link href={ctx.href} className="text-[#2A8AF6] text-xs flex items-center gap-1 hover:underline">
              View details <ExternalLink size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}