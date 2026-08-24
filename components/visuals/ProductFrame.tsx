import { cn } from '@/lib/cn';

interface ProductFrameProps {
  children: React.ReactNode;
  className?: string;
  url?: string;
}

export default function ProductFrame({ children, className, url }: ProductFrameProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card overflow-hidden shadow-2xl flex flex-col', className)}>
      {/* Browser Chrome */}
      <div className="h-10 border-b border-border bg-muted flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
        </div>
        {url && (
          <div className="flex-1 flex justify-center">
            <div className="bg-background/50 text-[10px] text-muted-foreground px-4 py-1 rounded-full font-mono">
              {url}
            </div>
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-background">
        {children}
      </div>
    </div>
  );
}
