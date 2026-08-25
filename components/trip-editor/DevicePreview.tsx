'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DevicePreviewProps {
  url: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
}

export default function DevicePreview({ url, deviceType }: DevicePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  const deviceStyles = {
    desktop: { width: '100%', height: '100%', borderRadius: '0.5rem' },
    tablet: { width: '768px', height: '1024px', borderRadius: '1.5rem', border: '12px solid #1f2937' },
    mobile: { width: '375px', height: '812px', borderRadius: '2.5rem', border: '12px solid #1f2937' },
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg p-4 overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/50 backdrop-blur-sm z-10">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Loading preview...</span>
        </div>
      )}
      <div 
        className="bg-background shadow-2xl overflow-hidden transition-all duration-300 relative"
        style={deviceStyles[deviceType]}
      >
        {/* Tablet/Mobile notch simulation */}
        {deviceType !== 'desktop' && (
          <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20 pointer-events-none">
            <div className="w-32 h-4 bg-[#1f2937] rounded-b-xl"></div>
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full border-0 bg-background"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
