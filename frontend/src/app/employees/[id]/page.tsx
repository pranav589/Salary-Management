'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Employee } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import EmployeeDetailCard from '@/components/employees/EmployeeDetailCard';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: employee, isLoading, error } = useQuery<Employee>({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#D3FE73]" />
        <p className="text-[#9BA3B2] text-sm">Fetching employee record details...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-red-400">Employee Not Found</h2>
        <p className="text-[#9BA3B2] text-sm">The employee record does not exist or has been removed.</p>
        <Link
          href="/employees"
          className="inline-flex items-center gap-2 bg-[#D3FE73] text-[#060A1E] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#CBDF7A]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back Button */}
      <button
        onClick={() => router.push('/employees')}
        className="flex items-center gap-2 text-xs font-semibold text-[#9BA3B2] hover:text-[#D3FE73] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Employees List
      </button>

      {/* Main Detail Container Card */}
      <EmployeeDetailCard employee={employee} />
    </div>
  );
}
