import { Globe } from 'lucide-react';
import { AnalyticsByCountry } from '@/types';
import { formatUsd } from '@/lib/formatters';

interface GeographicDistributionTableProps {
  byCountry: AnalyticsByCountry[];
}

export default function GeographicDistributionTable({ byCountry }: GeographicDistributionTableProps) {
  return (
    <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-1.5 rounded bg-[#014D43] border border-[#CBDF7A] text-[#CBDF7A]">
          <Globe className="w-4 h-4" />
        </div>
        <h3 className="font-serif font-bold text-lg">Geographic Distribution</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1E294B] text-[#9BA3B2] text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-4">Country</th>
              <th className="py-4 px-4 text-center">Headcount</th>
              <th className="py-4 px-4 text-right">Average Salary (USD)</th>
              <th className="py-4 px-4 text-right">Monthly Payroll (USD)</th>
            </tr>
          </thead>
          <tbody>
            {byCountry.map((c) => (
              <tr
                key={c.country}
                className="border-b border-[#1E294B]/50 hover:bg-[#1E294B]/25 transition-colors text-sm"
              >
                <td className="py-4 px-4 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5DC6D6]" />
                  {c.country === 'US'
                    ? 'United States'
                    : c.country === 'IN'
                    ? 'India'
                    : c.country === 'UK'
                    ? 'United Kingdom'
                    : c.country === 'DE'
                    ? 'Germany'
                    : c.country}
                </td>
                <td className="py-4 px-4 text-center text-[#F1F1F2]">{c.headcount}</td>
                <td className="py-4 px-4 text-right font-medium text-[#F1F1F2]">
                  {formatUsd(c.averageSalaryUsd)}
                </td>
                <td className="py-4 px-4 text-right font-semibold text-[#D3FE73]">
                  {formatUsd(c.totalMonthlyPayrollUsd)}
                </td>
              </tr>
            ))}
            {byCountry.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#9BA3B2]">
                  No location data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
