import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { formatCompactUsd } from '@/lib/formatters';
import { AnalyticsOverview } from '@/types';

interface KPICardsProps {
  overview?: AnalyticsOverview;
}

export default function KPICards({ overview }: KPICardsProps) {
  const stats = [
    {
      title: 'Active Employees',
      value: overview?.totalActiveEmployees.toLocaleString() ?? '0',
      icon: Users,
      desc: 'Current workforce size',
    },
    {
      title: 'Monthly Spend',
      value: formatCompactUsd(overview?.totalMonthlyPayrollUsd ?? 0),
      icon: DollarSign,
      desc: 'Total payroll spend',
    },
    {
      title: 'Average Salary',
      value: formatCompactUsd(overview?.averageSalaryUsd ?? 0),
      icon: TrendingUp,
      desc: 'Annualized mean pay',
    },
    {
      title: 'Median Salary',
      value: formatCompactUsd(overview?.medianSalaryUsd ?? 0),
      icon: Award,
      desc: 'Annualized mid pay',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.title}
            className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6 relative overflow-hidden group hover:border-[#D3FE73]/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider">
                {s.title}
              </span>
              <div className="p-2 rounded-lg bg-[#060A1E] text-[#D3FE73] border border-[#1E294B]">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-1 tracking-tight text-[#F1F1F2]">
              {s.value}
            </h3>
            <p className="text-xs text-[#9BA3B2]">{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
