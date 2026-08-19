'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Employee } from '@/types';
import EmployeeForm from '@/components/EmployeeForm';
import EmployeeFilters from '@/components/employees/EmployeeFilters';
import EmployeeTable from '@/components/employees/EmployeeTable';
import { Plus, X } from 'lucide-react';
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet';

export default function EmployeesPage() {
  const queryClient = useQueryClient();

  // Filters State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  // Fetch Employees List with React Query
  const { data, isLoading: loading } = useQuery({
    queryKey: [
      'employees',
      { page, limit, search, country, department, employmentType, status, sortBy, sortOrder },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) params.append('search', search);
      if (country) params.append('country', country);
      if (department) params.append('department', department);
      if (employmentType) params.append('employmentType', employmentType);
      if (status) params.append('status', status);

      const res = await api.get(`/employees?${params.toString()}`);
      return res.data;
    },
  });

  const employees: Employee[] = data?.data || [];
  const pagination = data?.pagination || null;

  // Mutation for creating/updating employee
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      if (selectedEmployee) {
        return api.put(`/employees/${selectedEmployee.id}`, values);
      } else {
        return api.post('/employees', values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setIsFormOpen(false);
      setSelectedEmployee(undefined);
    },
  });

  // Mutation for toggling active/inactive status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return api.patch(`/employees/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const handleCreateOrUpdate = async (values: any) => {
    await saveMutation.mutateAsync(values);
  };

  const handleToggleStatus = (emp: Employee) => {
    const newStatus = emp.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    statusMutation.mutate({ id: emp.id, status: newStatus });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCountry('');
    setDepartment('');
    setEmploymentType('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight mb-1 text-[#F1F1F2]">
            Employee Management
          </h1>
          <p className="text-[#9BA3B2] text-sm">
            Monitor, update, and coordinate compensation for ACME staff.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEmployee(undefined);
            setIsFormOpen(true);
          }}
          className="bg-[#D3FE73] hover:bg-[#CBDF7A] text-[#060A1E] px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Employee
        </button>
      </div>

      {/* Filters Bar */}
      <EmployeeFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        country={country}
        setCountry={(val) => {
          setCountry(val);
          setPage(1);
        }}
        department={department}
        setDepartment={(val) => {
          setDepartment(val);
          setPage(1);
        }}
        employmentType={employmentType}
        setEmploymentType={(val) => {
          setEmploymentType(val);
          setPage(1);
        }}
        status={status}
        setStatus={(val) => {
          setStatus(val);
          setPage(1);
        }}
        clearFilters={clearFilters}
      />

      {/* Main Table */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        handleToggleStatus={handleToggleStatus}
        setSelectedEmployee={setSelectedEmployee}
        setIsFormOpen={setIsFormOpen}
        pagination={pagination}
        setPage={setPage}
      />

      {/* Dialog Slideover Panel for Add/Edit Form */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#1E294B] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#F1F1F2]">
                {selectedEmployee ? `Edit Profile: ${selectedEmployee.name}` : 'Register New Employee'}
              </h3>
              <SheetClose className="p-1.5 hover:bg-[#1E294B] text-[#9BA3B2] hover:text-[#F1F1F2] rounded transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </SheetClose>
            </div>
            
            <EmployeeForm
              employee={selectedEmployee}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
