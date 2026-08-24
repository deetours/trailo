'use client';

import React from 'react';

export default function WhatsAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-6 md:-mt-10 -mx-6 md:-mx-10 overflow-hidden">
      {children}
    </div>
  );
}
