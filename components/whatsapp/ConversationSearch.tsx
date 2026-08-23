import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export function ConversationSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [val, setVal] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(val), 200);
    return () => clearTimeout(timer);
  }, [val, onSearch]);

  return (
    <div className="p-4 border-b border-[#222]">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
        <input 
          type="text" 
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="Search conversations..." 
          className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-9 py-2 text-sm focus:border-[#444] focus:outline-none transition-colors"
        />
        {val && (
          <button onClick={() => setVal("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#ccc]">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}