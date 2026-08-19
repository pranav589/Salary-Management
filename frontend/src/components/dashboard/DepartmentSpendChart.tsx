import { Briefcase } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnalyticsByDepartment } from '@/types';
import { formatUsd } from '@/lib/formatters';

interface DepartmentSpendChartProps {
  byDepartment: AnalyticsByDepartment[];
}

const COLORS = ['#D3FE73', '#5DC6D6', '#CBDF7A', '#014D43', '#2563EB', '#F59E0B', '#EF4444'];

export default function DepartmentSpendChart({ byDepartment }: DepartmentSpendChartProps) {
  return (
    <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-1.5 rounded bg-[#014D43] border border-[#5DC6D6] text-[#5DC6D6]">
          <Briefcase className="w-4 h-4" />
        </div>
        <h3 className="font-serif font-bold text-lg">Department Spend</h3>
      </div>
      <div className="h-80 w-full flex flex-col justify-center">
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byDepartment}
                dataKey="totalMonthlyPayrollUsd"
                nameKey="department"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
              >
                {byDepartment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatUsd(Number(value || 0))}
                contentStyle={{
                  backgroundColor: '#0B1333',
                  borderColor: '#1E294B',
                  borderRadius: '8px',
                  color: '#F1F1F2',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
          {byDepartment.slice(0, 5).map((d, index) => (
            <div key={d.department} className="flex items-center gap-1.5 text-xs text-[#9BA3B2]">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{d.department}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
