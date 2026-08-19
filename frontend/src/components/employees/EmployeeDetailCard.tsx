import { Employee } from '@/types';
import { formatUsd, formatLocalCurrency, formatDate, getCountryName } from '@/lib/formatters';
import { useQuery } from '@tanstack/react-query';
import { getSystemConfig } from '@/lib/api';
import {
  Briefcase,
  Mail,
  MapPin,
  Calendar,
  Shield,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface EmployeeDetailCardProps {
  employee: Employee;
}

export default function EmployeeDetailCard({ employee }: EmployeeDetailCardProps) {
  const { data: config } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: getSystemConfig,
  });
  return (
    <div className="bg-[#0B1333] border border-[#1E294B] rounded-3xl overflow-hidden shadow-xl">
      {/* Profile Banner */}
      <div className="p-8 border-b border-[#1E294B] bg-[#060A1E]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#014D43] border border-[#D3FE73] flex items-center justify-center font-serif text-[#D3FE73] text-2xl font-bold">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-1">
              {employee.name}
            </h2>
            <p className="text-[#9BA3B2] text-sm flex items-center gap-2">
              <span className="font-mono text-xs bg-[#1E294B] px-1.5 py-0.5 rounded text-[#D3FE73]">
                {employee.employeeId}
              </span>
              <span>•</span>
              <span>{employee.role}</span>
            </p>
          </div>
        </div>
        <span
          className={`self-start md:self-center inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold ${
            employee.status === 'ACTIVE'
              ? 'bg-[#014D43] text-[#D3FE73] border border-[#D3FE73]/25 shadow-md shadow-[#D3FE73]/5'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {employee.status === 'ACTIVE' ? 'Active Account' : 'Inactive Account'}
        </span>
      </div>

      {/* Profile Body Info */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Job Details */}
        <div className="space-y-6">
          <h3 className="text-[#D3FE73] text-xs font-bold uppercase tracking-wider border-b border-[#1E294B] pb-2">
            Employment Profile
          </h3>
          
          <div className="space-y-4">
            {/* Department */}
            <div className="flex gap-3">
              <div className="p-2 bg-[#060A1E] border border-[#1E294B] rounded-lg text-[#9BA3B2] h-10 w-10 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-[#9BA3B2]">Department</span>
                <span className="text-sm font-semibold text-[#F1F1F2]">{employee.department}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-3">
              <div className="p-2 bg-[#060A1E] border border-[#1E294B] rounded-lg text-[#9BA3B2] h-10 w-10 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-[#9BA3B2]">Email Address</span>
                <span className="text-sm font-semibold text-[#F1F1F2]">{employee.email}</span>
              </div>
            </div>

            {/* Country */}
            <div className="flex gap-3">
              <div className="p-2 bg-[#060A1E] border border-[#1E294B] rounded-lg text-[#9BA3B2] h-10 w-10 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-[#9BA3B2]">Tax Location</span>
                <span className="text-sm font-semibold text-[#F1F1F2]">
                  {getCountryName(employee.country, config?.countries)} ({employee.country})
                </span>
              </div>
            </div>

            {/* Hire Date */}
            <div className="flex gap-3">
              <div className="p-2 bg-[#060A1E] border border-[#1E294B] rounded-lg text-[#9BA3B2] h-10 w-10 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-[#9BA3B2]">Join Date</span>
                <span className="text-sm font-semibold text-[#F1F1F2]">{formatDate(employee.hireDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Compensation Details */}
        <div className="space-y-6">
          <h3 className="text-[#5DC6D6] text-xs font-bold uppercase tracking-wider border-b border-[#1E294B] pb-2">
            Compensation Metrics
          </h3>

          <div className="space-y-4">
            {/* Type */}
            <div className="flex gap-3">
              <div className="p-2 bg-[#060A1E] border border-[#1E294B] rounded-lg text-[#9BA3B2] h-10 w-10 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-[#9BA3B2]">Classification</span>
                <span className="text-sm font-semibold text-[#F1F1F2]">
                  {employee.employmentType.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Local Currency Salary */}
            <div className="flex gap-3">
              <div className="p-2 bg-[#060A1E] border border-[#1E294B] rounded-lg text-[#9BA3B2] h-10 w-10 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-[#9BA3B2]">Local Base Salary</span>
                <span className="text-sm font-semibold text-[#F1F1F2] font-mono">
                  {formatLocalCurrency(employee.salary, employee.currency)}
                </span>
              </div>
            </div>

            {/* Normalized USD Salary */}
            <div className="flex gap-3 bg-[#014D43]/20 border border-[#014D43]/40 p-4 rounded-2xl">
              <div className="p-2.5 bg-[#014D43] border border-[#D3FE73]/30 rounded-xl text-[#D3FE73] h-11 w-11 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-xs text-[#9BA3B2]">Annualized Normalized (USD)</span>
                <span className="text-xl font-bold font-mono text-[#D3FE73] tracking-tight">
                  {formatUsd(employee.salaryUsd)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
