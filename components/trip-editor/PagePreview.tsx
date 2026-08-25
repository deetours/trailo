'use client';

import { useState } from 'react';
import DevicePreview from './DevicePreview';
import { Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PagePreviewProps {
  url: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export default function PagePreview({ url }: PagePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          {devices.map((d) => {
            const Icon = d.icon;
            const isActive = device === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                className={`p-2 rounded-md flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-background shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'
                }`}
                title={d.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
        
        <Link
          href={url}
          target="_blank"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Open in new tab
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4 bg-muted/20">
        <DevicePreview url={url} deviceType={device} />
      </div>
    </div>
  );
}
