'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getSystemConfig } from '@/lib/api';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
  department: z.string().min(1, 'Department is required'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  salary: z.coerce.number().positive('Salary must be a positive number'),
  currency: z.string().min(1, 'Currency is required'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  hireDate: z.string().min(1, 'Hire date is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);

  const { data: config } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: getSystemConfig,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      department: '',
      role: '',
      salary: 0,
      currency: 'USD',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
      hireDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCountry = watch('country');

  // Auto-populate currency when country is selected
  useEffect(() => {
    if (selectedCountry && config?.countries) {
      const match = config.countries.find((c) => c.code === selectedCountry);
      if (match) {
        setValue('currency', match.currency);
      }
    }
  }, [selectedCountry, config, setValue]);

  // Load existing employee data if editing
  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        country: employee.country,
        department: employee.department,
        role: employee.role,
        salary: employee.salary,
        currency: employee.currency,
        employmentType: employee.employmentType,
        status: employee.status,
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
      });
    }
  }, [employee, reset]);

  const onFormSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        hireDate: new Date(data.hireDate).toISOString(),
      };
      await onSubmit(payload);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const countries = config?.countries || [];
  const departments = config?.departments || [];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 text-[#F1F1F2]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Full Name</label>
          <input
            {...register('name')}
            className="w-full bg-[#060A1E] border border-[#1E294B] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D3FE73] focus:ring-1 focus:ring-[#D3FE73] transition-colors text-[#F1F1F2]"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Email Address</label>
          <input
            {...register('email')}
            type="email"
            className="w-full bg-[#060A1E] border border-[#1E294B] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D3FE73] focus:ring-1 focus:ring-[#D3FE73] transition-colors text-[#F1F1F2]"
            placeholder="john.doe@company.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-sm text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && <p className="text-red-400 text-xs mt-1.5">{errors.country.message}</p>}
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Department</label>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-sm text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.department && <p className="text-red-400 text-xs mt-1.5">{errors.department.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Role/Job Title</label>
          <input
            {...register('role')}
            className="w-full bg-[#060A1E] border border-[#1E294B] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D3FE73] focus:ring-1 focus:ring-[#D3FE73] transition-colors text-[#F1F1F2]"
            placeholder="Senior Product Designer"
          />
          {errors.role && <p className="text-red-400 text-xs mt-1.5">{errors.role.message}</p>}
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Employment Type</label>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-sm text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
                  <SelectItem value="FULL_TIME">Full-time</SelectItem>
                  <SelectItem value="PART_TIME">Part-time</SelectItem>
                  <SelectItem value="CONTRACTOR">Contractor</SelectItem>
                  <SelectItem value="INTERN">Intern</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.employmentType && <p className="text-red-400 text-xs mt-1.5">{errors.employmentType.message}</p>}
        </div>

        {/* Salary */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Annual Base Salary</label>
          <input
            {...register('salary')}
            type="number"
            className="w-full bg-[#060A1E] border border-[#1E294B] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D3FE73] focus:ring-1 focus:ring-[#D3FE73] transition-colors text-[#F1F1F2]"
            placeholder="80000"
          />
          {errors.salary && <p className="text-red-400 text-xs mt-1.5">{errors.salary.message}</p>}
        </div>

        {/* Currency */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Currency</label>
          <input
            {...register('currency')}
            readOnly
            className="w-full bg-[#060A1E]/50 border border-[#1E294B] rounded-lg px-4 py-2.5 text-sm text-[#9BA3B2] cursor-not-allowed outline-none"
            placeholder="Select a country first"
          />
          {errors.currency && <p className="text-red-400 text-xs mt-1.5">{errors.currency.message}</p>}
        </div>

        {/* Hire Date */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Date of Hire</label>
          <input
            {...register('hireDate')}
            type="date"
            className="w-full bg-[#060A1E] border border-[#1E294B] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D3FE73] focus:ring-1 focus:ring-[#D3FE73] transition-colors text-[#F1F1F2]"
          />
          {errors.hireDate && <p className="text-red-400 text-xs mt-1.5">{errors.hireDate.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-[#9BA3B2] uppercase tracking-wider mb-2">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#060A1E] border-[#1E294B] text-sm text-[#9BA3B2] focus:border-[#D3FE73] focus:ring-0">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B1333] border-[#1E294B] text-[#9BA3B2]">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[#1E294B] mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="bg-transparent hover:bg-[#1E294B]/50 text-[#9BA3B2] hover:text-[#F1F1F2] px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-[#1E294B]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#D3FE73] hover:bg-[#CBDF7A] text-[#060A1E] px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {employee ? 'Save Changes' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
}
