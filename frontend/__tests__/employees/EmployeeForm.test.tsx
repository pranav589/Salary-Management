import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeForm from '../../src/components/EmployeeForm';
import { Employee } from '../../src/types';
import '@testing-library/jest-dom';

// Mock UI Select components with native HTML select elements for seamless JSDOM form interaction
jest.mock('../../src/components/ui/select', () => {
  return {
    Select: ({ children, value, onValueChange }: any) => (
      <select data-testid="mock-select" value={value} onChange={(e) => onValueChange(e.target.value)}>
        {children}
      </select>
    ),
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <>{placeholder}</>,
  };
});

describe('EmployeeForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  const mockEmployee: Employee = {
    id: '1',
    employeeId: 'EMP-00001',
    name: 'Jane Doe',
    email: 'jane@example.com',
    country: 'UK',
    department: 'Marketing',
    role: 'Marketer',
    salary: 95000,
    currency: 'GBP',
    salaryUsd: 120000,
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    hireDate: '2023-05-10',
    createdAt: '2023-05-10',
    updatedAt: '2023-05-10',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields correctly', () => {
    render(<EmployeeForm {...defaultProps} />);
    
    // Check text inputs by placeholder
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john.doe@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senior Product Designer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('80000')).toBeInTheDocument();
  });

  it('populates fields correctly when employee is provided (edit mode)', () => {
    render(<EmployeeForm {...defaultProps} employee={mockEmployee} />);
    
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Marketer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('95000')).toBeInTheDocument();
  });

  it('displays validation errors on empty submission', async () => {
    render(<EmployeeForm {...defaultProps} />);
    
    const submitBtn = screen.getByRole('button', { name: /Add Employee/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form values on successful submit', async () => {
    render(<EmployeeForm {...defaultProps} />);
    
    // Fill text inputs
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Alice Smith' } });
    fireEvent.change(screen.getByPlaceholderText('john.doe@company.com'), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Senior Product Designer'), { target: { value: 'Principal Developer' } });
    fireEvent.change(screen.getByPlaceholderText('80000'), { target: { value: '150000' } });

    // Select options (Country, Department, Type, Currency)
    const selectElements = screen.getAllByTestId('mock-select');
    fireEvent.change(selectElements[0], { target: { value: 'US' } }); // Country
    fireEvent.change(selectElements[1], { target: { value: 'Engineering' } }); // Department
    fireEvent.change(selectElements[2], { target: { value: 'FULL_TIME' } }); // Employment Type
    fireEvent.change(selectElements[3], { target: { value: 'USD' } }); // Currency

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /Add Employee/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<EmployeeForm {...defaultProps} />);
    
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
