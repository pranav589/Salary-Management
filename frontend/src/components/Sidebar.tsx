'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, RefreshCw, Circle } from 'lucide-react';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Sidebar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Fetch exchange rates sync status
  const { data: exchangeRates } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      const res = await api.get('/exchange-rates');
      return res.data;
    },
    
  });

  const rates = exchangeRates?.data || [];
  const lastSynced = rates.length > 0
    ? (() => {
        const mostRecent = rates.reduce((prev: any, current: any) => {
          return new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current;
        });
        return new Date(mostRecent.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      })()
    : null;

  // Sync exchange rates mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      return api.post('/exchange-rates/sync');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const syncing = syncMutation.isPending;

  const handleSync = async () => {
    if (syncMutation.isPending) return;
    try {
      await syncMutation.mutateAsync();
    } catch (e) {
      console.error('Sync failed', e);
    }
  };


  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Employees', href: '/employees', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#0B1333] border-r border-[#1E294B] flex flex-col h-screen fixed left-0 top-0 text-[#F1F1F2] z-20">
      {/* Brand Logo / Header */}
      <div className="p-6 border-b border-[#1E294B] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#014D43] border border-[#D3FE73] flex items-center justify-center font-serif text-[#D3FE73] font-bold text-lg">
          A
        </div>
        <div>
          <h1 className="font-serif font-bold text-lg tracking-tight leading-none">ACME Corp</h1>
          <span className="text-xs text-[#9BA3B2] font-sans tracking-wider uppercase">Salary Panel</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#014D43] text-[#D3FE73] border-l-4 border-[#D3FE73] shadow-md shadow-[#D3FE73]/5'
                  : 'text-[#9BA3B2] hover:text-[#F1F1F2] hover:bg-[#1E294B]/50'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#D3FE73]' : 'text-[#9BA3B2] group-hover:text-[#F1F1F2]'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Live Exchange Rate Widget */}
      <div className="p-4 border-t border-[#1E294B] bg-[#060A1E]/30 m-4 rounded-xl border border-[#1E294B]/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-[#9BA3B2]">
            <Circle className="w-2.5 h-2.5 fill-[#D3FE73] text-[#D3FE73] animate-pulse" />
            <span>FX rates live</span>
          </div>
          {lastSynced && (
            <span className="text-[10px] text-[#9BA3B2] bg-[#1E294B] px-1.5 py-0.5 rounded">
              Synced: {lastSynced}
            </span>
          )}
        </div>
        <p className="text-xs text-[#9BA3B2] mb-3 leading-relaxed">
          Daily USD conversions computed in real time.
        </p>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="w-full flex items-center justify-center gap-2 bg-[#1E294B] hover:bg-[#014D43] hover:text-[#D3FE73] text-[#F1F1F2] py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-[#D3FE73]' : ''}`} />
          {syncing ? 'Syncing Rates...' : 'Sync Rates Now'}
        </button>
      </div>
    </aside>
  );
}
