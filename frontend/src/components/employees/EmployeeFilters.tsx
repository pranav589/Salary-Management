'use client';

import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmployeeFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  employmentType: string;
  setEmploymentType: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  clearFilters: () => void;
}

const COUNTRIES = [
  { value: 'ALL', label: 'All Countries' },
  { value: 'US', label: 'United States (US)' },
  { value: 'IN', label: 'India (IN)' },
  { value: 'UK', label: 'United Kingdom (UK)' },
  { value: 'DE', label: 'Germany (DE)' },
];

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
];

const DEPARTMENT_OPTIONS = [
  { value: 'ALL', label: 'All Departments' },
  ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
];

const EMPLOYMENT_TYPES = [
  { value: 'ALL', label: 'All Types' },
  { value: 'FULL_TIME', label: 'Full-Time' },
  { value: 'PART_TIME', label: 'Part-Time' },
  { value: 'CONTRACTOR', label: 'Contractor' },
  { value: 'INTERN', label: 'Intern' },
];

const STATUSES = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function EmployeeFilters({
  search,
  setSearch,
  country,
  setCountry,
  department,
  setDepartment,
  employmentType,
  setEmploymentType,
  status,
  setStatus,
  clearFilters,
}: EmployeeFiltersProps) {
  return (
    <div className="bg-[#0B1333] border border-[#1E294B] rounded-2xl p-5 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#9BA3B2]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or email..."
            className="w-full bg-[#060A1E] border border-[#1E294B] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D3FE73] transition-colors text-[#F1F1F2]"
          />
        </div>

        <button
          onClick={clearFilters}
          className="text-xs text-[#9BA3B2] hover:text-[#D3FE73] font-semibold border border-[#1E294B] px-4 py-2.5 rounded-lg hover:bg-[#1E294B]/50 transition-all duration-200"
        >
          Clear Filters
        </button>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
        {/* Country */}
        <div>
          <Select value={country || 'ALL'} onValueChange={(val) => setCountry(val === 'ALL' || !val ? '' : val)}>
            <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-xs h-9 text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
              {COUNTRIES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department */}
        <div>
          <Select value={department || 'ALL'} onValueChange={(val) => setDepartment(val === 'ALL' || !val ? '' : val)}>
            <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-xs h-9 text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
              {DEPARTMENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div>
          <Select value={employmentType || 'ALL'} onValueChange={(val) => setEmploymentType(val === 'ALL' || !val ? '' : val)}>
            <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-xs h-9 text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
              {EMPLOYMENT_TYPES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Select value={status || 'ALL'} onValueChange={(val) => setStatus(val === 'ALL' || !val ? '' : val)}>
            <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-xs h-9 text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
              {STATUSES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
