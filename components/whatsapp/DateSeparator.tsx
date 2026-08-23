import React from "react";
import { formatDateSeparator } from "@/lib/whatsapp/format";

export function DateSeparator({ timestamp }: { timestamp: string }) {
  return (
    <div className="flex justify-center my-6">
      <div className="bg-[#111] border border-[#222] px-3 py-1 rounded-full text-xs text-[#888]">
        {formatDateSeparator(timestamp)}
      </div>
    </div>
  );
}