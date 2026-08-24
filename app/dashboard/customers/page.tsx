'use client';

import { useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Search, Mail, Phone, MessageSquare } from 'lucide-react';
import Card from '@/components/Card';
import { useCustomers } from '@/lib/api/customers/hooks/useCustomers';
import { useSession } from '@/lib/api/auth/hooks/useSession';

function CustomersList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSession();
  const businessId = session?.businessId || '';

  const q = searchParams.get('q') || '';
  const { customers, isLoading } = useCustomers(businessId);
  const [searchInput, setSearchInput] = useState(q);

  const filtered = useMemo(() => {
    if (!q) return customers;
    const query = q.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(query) || c.phone.toLowerCase().includes(query));
  }, [customers, q]);

  const updateFilters = (updates: { q?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.q !== undefined) params.set('q', updates.q);
    router.replace(`/dashboard/customers?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
            Customers
          </h1>
          <p className="text-muted-foreground">Everyone who has booked or converted from a lead.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilters({ q: searchInput });
            }}
            onBlur={() => updateFilters({ q: searchInput })}
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent w-full md:w-64"
          />
        </div>
      </header>

      <div className="pt-2">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-foreground mb-2">No customers yet</h3>
            <p className="text-muted-foreground mb-6">
              {q ? 'Try adjusting your search.' : 'Customers appear here once a lead is converted or a booking is made.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(customer => (
              <Card key={customer.id} rounded="xl" className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <Link href={`/dashboard/customers/${customer.id}`} className="group">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{customer.name}</h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1.5"><Phone size={14} /> {customer.phone}</span>
                    {customer.email && (
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {customer.email}</span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={14} /> {customer.notes.length} note{customer.notes.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
                <Link href={`/dashboard/customers/${customer.id}`} className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1 shrink-0">
                  View <ArrowRight size={14} />
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersList />
    </Suspense>
  );
}
