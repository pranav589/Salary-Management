import { Employee } from '@/types';
import { formatUsd, formatLocalCurrency } from '@/lib/formatters';
import {
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: string) => void;
  handleToggleStatus: (emp: Employee) => void;
  setSelectedEmployee: (emp: Employee) => void;
  setIsFormOpen: (open: boolean) => void;
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  } | null;
  setPage: (page: number) => void;
}

export default function EmployeeTable({
  employees,
  loading,
  sortBy,
  sortOrder,
  handleSort,
  handleToggleStatus,
  setSelectedEmployee,
  setIsFormOpen,
  pagination,
  setPage,
}: EmployeeTableProps) {
  return (
    <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D3FE73]" />
          <span className="text-xs text-[#9BA3B2]">Loading employee listing...</span>
        </div>
      ) : (
        <Table>
          <TableHeader className="border-b border-[#1E294B] bg-[#060A1E]/30">
            <TableRow className="border-b border-[#1E294B]/50 hover:bg-[#060A1E]/40">
              <TableHead
                className="py-4 px-6 cursor-pointer text-[#9BA3B2] hover:text-[#F1F1F2] transition-colors text-xs font-semibold uppercase tracking-wider h-auto align-middle"
                onClick={() => handleSort('employeeId')}
              >
                ID {sortBy === 'employeeId' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead
                className="py-4 px-6 cursor-pointer text-[#9BA3B2] hover:text-[#F1F1F2] transition-colors text-xs font-semibold uppercase tracking-wider h-auto align-middle"
                onClick={() => handleSort('name')}
              >
                Employee {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead className="py-4 px-6 text-[#9BA3B2] text-xs font-semibold uppercase tracking-wider h-auto align-middle">
                Dept / Role
              </TableHead>
              <TableHead className="py-4 px-6 text-[#9BA3B2] text-xs font-semibold uppercase tracking-wider h-auto align-middle">
                Location
              </TableHead>
              <TableHead className="py-4 px-6 text-right text-[#9BA3B2] text-xs font-semibold uppercase tracking-wider h-auto align-middle">
                Local Pay
              </TableHead>
              <TableHead
                className="py-4 px-6 text-right cursor-pointer text-[#9BA3B2] hover:text-[#F1F1F2] transition-colors text-xs font-semibold uppercase tracking-wider h-auto align-middle"
                onClick={() => handleSort('salary')}
              >
                USD Norm {sortBy === 'salary' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead className="py-4 px-6 text-center text-[#9BA3B2] text-xs font-semibold uppercase tracking-wider h-auto align-middle">
                Status
              </TableHead>
              <TableHead className="py-4 px-6 text-right text-[#9BA3B2] text-xs font-semibold uppercase tracking-wider h-auto align-middle">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow
                key={emp.id}
                className="border-b border-[#1E294B]/50 hover:bg-[#1E294B]/20 transition-all duration-150 text-sm"
              >
                {/* ID */}
                <TableCell className="py-4 px-6 font-mono text-xs text-[#9BA3B2] align-middle">
                  {emp.employeeId}
                </TableCell>

                {/* Employee Profile */}
                <TableCell className="py-4 px-6 align-middle">
                  <div className="font-semibold text-[#F1F1F2]">{emp.name}</div>
                  <div className="text-xs text-[#9BA3B2]">{emp.email}</div>
                </TableCell>

                {/* Dept / Role */}
                <TableCell className="py-4 px-6 align-middle">
                  <div className="text-[#F1F1F2]">{emp.department}</div>
                  <div className="text-xs text-[#9BA3B2]">{emp.role}</div>
                </TableCell>

                {/* Country Code */}
                <TableCell className="py-4 px-6 align-middle">
                  <span className="inline-flex items-center gap-1.5 bg-[#060A1E] border border-[#1E294B] px-2.5 py-1 rounded-md text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5DC6D6]" />
                    {emp.country}
                  </span>
                </TableCell>

                {/* Local Pay */}
                <TableCell className="py-4 px-6 text-right font-mono text-xs text-[#9BA3B2] align-middle">
                  {formatLocalCurrency(emp.salary, emp.currency)}
                </TableCell>

                {/* USD Normalized */}
                <TableCell className="py-4 px-6 text-right font-semibold font-mono text-[#D3FE73] align-middle">
                  {formatUsd(emp.salaryUsd)}
                </TableCell>

                {/* Status Badge */}
                <TableCell className="py-4 px-6 text-center align-middle">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      emp.status === 'ACTIVE'
                        ? 'bg-[#014D43] text-[#D3FE73] border border-[#D3FE73]/25 shadow-md shadow-[#D3FE73]/5'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {emp.status}
                  </span>
                </TableCell>

                {/* Actions Menu */}
                <TableCell className="py-4 px-6 text-right align-middle">
                  <div className="flex justify-end items-center gap-2">
                    <Link
                      href={`/employees/${emp.id}`}
                      className="p-1.5 hover:bg-[#1E294B] text-[#9BA3B2] hover:text-[#5DC6D6] rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsFormOpen(true);
                      }}
                      className="p-1.5 hover:bg-[#1E294B] text-[#9BA3B2] hover:text-[#D3FE73] rounded transition-colors"
                      title="Edit Employee"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(emp)}
                      className={`p-1.5 hover:bg-[#1E294B] rounded transition-colors ${
                        emp.status === 'ACTIVE'
                          ? 'text-[#9BA3B2] hover:text-red-400'
                          : 'text-[#9BA3B2] hover:text-emerald-400'
                      }`}
                      title={emp.status === 'ACTIVE' ? 'Deactivate Employee' : 'Activate Employee'}
                    >
                      {emp.status === 'ACTIVE' ? (
                        <Trash2 className="w-4.5 h-4.5" />
                      ) : (
                        <CheckCircle className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-[#9BA3B2]">
                  No matching records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Pagination Footer */}
      {!loading && pagination && pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-[#1E294B] flex items-center justify-between bg-[#060A1E]/10">
          <span className="text-xs text-[#9BA3B2]">
            Showing page <strong className="text-[#F1F1F2]">{pagination.page}</strong> of{' '}
            <strong className="text-[#F1F1F2]">{pagination.pages}</strong>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              data-testid="prev-page-btn"
              className="p-1.5 bg-[#060A1E] border border-[#1E294B] text-[#9BA3B2] hover:text-[#F1F1F2] hover:bg-[#1E294B] rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              data-testid="next-page-btn"
              className="p-1.5 bg-[#060A1E] border border-[#1E294B] text-[#9BA3B2] hover:text-[#F1F1F2] hover:bg-[#1E294B] rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
