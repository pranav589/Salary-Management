import { render, screen } from '@testing-library/react';
import KPICards from '../../src/components/dashboard/KPICards';
import { AnalyticsOverview } from '../../src/types';
import '@testing-library/jest-dom';

describe('KPICards Component', () => {
  const mockOverview: AnalyticsOverview = {
    totalActiveEmployees: 42,
    totalMonthlyPayrollUsd: 12500.5,
    averageSalaryUsd: 85000,
    medianSalaryUsd: 78000,
  };

  it('renders stats titles correctly', () => {
    render(<KPICards overview={mockOverview} />);
    
    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Average Salary')).toBeInTheDocument();
    expect(screen.getByText('Median Salary')).toBeInTheDocument();
  });

  it('formats and displays overview values correctly', () => {
    render(<KPICards overview={mockOverview} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('$12,500.50')).toBeInTheDocument();
    expect(screen.getByText('$85,000.00')).toBeInTheDocument();
    expect(screen.getByText('$78,000.00')).toBeInTheDocument();
  });

  it('renders default zero states when no overview data is provided', () => {
    render(<KPICards />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getAllByText('$0.00')).toHaveLength(3); // Monthly spend, average, median
  });
});
