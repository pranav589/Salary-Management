'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  AnalyticsOverview,
  AnalyticsByCountry,
  AnalyticsByDepartment,
  SalaryDistributionBand,
} from '@/types';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import KPICards from '@/components/dashboard/KPICards';
import GeographicDistributionTable from '@/components/dashboard/GeographicDistributionTable';

// Dynamically import Recharts-heavy components
const SalaryDistributionChart = dynamic(
  () => import('@/components/dashboard/SalaryDistributionChart'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6 lg:col-span-2 h-[410px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D3FE73]" />
        <span className="text-xs text-[#9BA3B2]">Loading salary distribution bands...</span>
      </div>
    ),
  }
);

const DepartmentSpendChart = dynamic(
  () => import('@/components/dashboard/DepartmentSpendChart'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6 h-[410px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#5DC6D6]" />
        <span className="text-xs text-[#9BA3B2]">Loading department spend...</span>
      </div>
    ),
  }
);

export default function Home() {
  // Fetch Overview Data
  const { data: overview, isLoading: overviewLoading } = useQuery<AnalyticsOverview>({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const res = await api.get('/analytics/overview');
      return res.data.data;
    },
  });

  // Fetch Country Breakdown
  const { data: byCountry = [], isLoading: countryLoading } = useQuery<AnalyticsByCountry[]>({
    queryKey: ['analytics', 'country'],
    queryFn: async () => {
      const res = await api.get('/analytics/by-country');
      return res.data.data;
    },
  });

  // Fetch Department Breakdown
  const { data: byDepartment = [], isLoading: departmentLoading } = useQuery<AnalyticsByDepartment[]>({
    queryKey: ['analytics', 'department'],
    queryFn: async () => {
      const res = await api.get('/analytics/by-department');
      return res.data.data;
    },
  });

  // Fetch Salary Distribution
  const { data: distribution = [], isLoading: distributionLoading } = useQuery<SalaryDistributionBand[]>({
    queryKey: ['analytics', 'distribution'],
    queryFn: async () => {
      const res = await api.get('/analytics/salary-distribution');
      return res.data.data;
    },
  });

  const loading = overviewLoading || countryLoading || departmentLoading || distributionLoading;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#D3FE73]" />
        <p className="text-[#9BA3B2] text-sm font-medium">Fetching payroll analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Dashboard Overview
        </h1>
        <p className="text-[#9BA3B2] text-sm">
          USD-normalized compensation distribution and organizational breakdown.
        </p>
      </div>

      {/* Stats Grid */}
      <KPICards overview={overview} />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6 lg:col-span-2 h-[410px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#D3FE73]" />
            </div>
          }
        >
          <SalaryDistributionChart distribution={distribution} />
        </Suspense>

        <Suspense
          fallback={
            <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6 h-[410px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#5DC6D6]" />
            </div>
          }
        >
          <DepartmentSpendChart byDepartment={byDepartment} />
        </Suspense>
      </div>

      {/* Country Breakdown Table */}
      <GeographicDistributionTable byCountry={byCountry} />
    </div>
  );
}
