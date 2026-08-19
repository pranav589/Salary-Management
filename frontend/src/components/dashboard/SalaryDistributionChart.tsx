import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SalaryDistributionBand } from '@/types';

interface SalaryDistributionChartProps {
  distribution: SalaryDistributionBand[];
}

export default function SalaryDistributionChart({ distribution }: SalaryDistributionChartProps) {
  return (
    <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-6 lg:col-span-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-1.5 rounded bg-[#014D43] border border-[#D3FE73] text-[#D3FE73]">
          <BarChart3 className="w-4 h-4" />
        </div>
        <h3 className="font-serif font-bold text-lg">Salary Distribution Bands</h3>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
            <XAxis
              dataKey="band"
              stroke="#9BA3B2"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9BA3B2"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B1333',
                borderColor: '#1E294B',
                borderRadius: '8px',
                color: '#F1F1F2',
                fontSize: '12px',
              }}
              cursor={{ fill: 'rgba(30, 41, 75, 0.3)' }}
            />
            <Bar dataKey="count" fill="#D3FE73" radius={[4, 4, 0, 0]}>
              {distribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? '#D3FE73' : '#CBDF7A'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
