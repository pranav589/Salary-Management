export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  country: string;
  department: string;
  role: string;
  salary: number;
  currency: string;
  salaryUsd: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
  status: 'ACTIVE' | 'INACTIVE';
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export interface ExchangeRate {
  id: string;
  currency: string;
  rateToUsd: number;
  updatedAt: string;
}

export interface AnalyticsOverview {
  totalActiveEmployees: number;
  totalMonthlyPayrollUsd: number;
  averageSalaryUsd: number;
  medianSalaryUsd: number;
}

export interface AnalyticsByCountry {
  country: string;
  headcount: number;
  totalMonthlyPayrollUsd: number;
  averageSalaryUsd: number;
}

export interface AnalyticsByDepartment {
  department: string;
  headcount: number;
  totalMonthlyPayrollUsd: number;
  averageSalaryUsd: number;
}

export interface SalaryDistributionBand {
  band: string;
  count: number;
}
