import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeTable from '../../src/components/employees/EmployeeTable';
import { Employee } from '../../src/types';
import '@testing-library/jest-dom';

describe('EmployeeTable Component', () => {
  const mockEmployees: Employee[] = [
    {
      id: '1',
      employeeId: 'EMP-00001',
      name: 'Alice Cooper',
      email: 'alice@example.com',
      country: 'US',
      department: 'Engineering',
      role: 'Engineer',
      salary: 100000,
      currency: 'USD',
      salaryUsd: 100000,
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
      hireDate: '2023-01-01',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    {
      id: '2',
      employeeId: 'EMP-00002',
      name: 'Bob Marley',
      email: 'bob@example.com',
      country: 'IN',
      department: 'Product',
      role: 'PM',
      salary: 2000000,
      currency: 'INR',
      salaryUsd: 24000,
      employmentType: 'FULL_TIME',
      status: 'INACTIVE',
      hireDate: '2023-01-01',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
  ];

  const mockHandleSort = jest.fn();
  const mockHandleToggleStatus = jest.fn();
  const mockSetSelectedEmployee = jest.fn();
  const mockSetIsFormOpen = jest.fn();
  const mockSetPage = jest.fn();

  const defaultProps = {
    employees: mockEmployees,
    loading: false,
    sortBy: 'name',
    sortOrder: 'asc' as const,
    handleSort: mockHandleSort,
    handleToggleStatus: mockHandleToggleStatus,
    setSelectedEmployee: mockSetSelectedEmployee,
    setIsFormOpen: mockSetIsFormOpen,
    pagination: {
      page: 1,
      pages: 3,
      total: 25,
      limit: 10,
    },
    setPage: mockSetPage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table columns correctly', () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText(/ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Employee/i)).toBeInTheDocument();
    expect(screen.getByText(/Dept \/ Role/i)).toBeInTheDocument();
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Local Pay/i)).toBeInTheDocument();
    expect(screen.getByText(/USD Norm/i)).toBeInTheDocument();
  });

  it('renders employee rows correctly', () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText('Alice Cooper')).toBeInTheDocument();
    expect(screen.getByText('Bob Marley')).toBeInTheDocument();
  });

  it('triggers sorting callback when column header is clicked', () => {
    render(<EmployeeTable {...defaultProps} />);
    
    const employeeHeader = screen.getByText(/Employee/i);
    fireEvent.click(employeeHeader);

    expect(mockHandleSort).toHaveBeenCalledWith('name');
  });

  it('triggers pagination setPage callback when next/prev buttons are clicked', () => {
    render(<EmployeeTable {...defaultProps} />);
    
    // Select pagination elements
    const nextBtn = screen.getByTestId('next-page-btn');
    fireEvent.click(nextBtn);

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it('triggers handleToggleStatus when deactivate status toggle is clicked', () => {
    render(<EmployeeTable {...defaultProps} />);
    
    // Select toggle buttons (Trash/Trash2 icon represents deactivate button for active employees)
    const actionBtns = screen.getAllByRole('button');
    // Find deactivate button for Alice
    const deactivateBtn = actionBtns.find(btn => btn.getAttribute('title') === 'Deactivate Employee');
    expect(deactivateBtn).toBeDefined();
    if (deactivateBtn) {
      fireEvent.click(deactivateBtn);
      expect(mockHandleToggleStatus).toHaveBeenCalledWith(mockEmployees[0]);
    }
  });

  it('triggers setSelectedEmployee and setIsFormOpen when edit button is clicked', () => {
    render(<EmployeeTable {...defaultProps} />);
    
    const actionBtns = screen.getAllByRole('button');
    const editBtn = actionBtns.find(btn => btn.getAttribute('title') === 'Edit Employee');
    expect(editBtn).toBeDefined();
    if (editBtn) {
      fireEvent.click(editBtn);
      expect(mockSetSelectedEmployee).toHaveBeenCalledWith(mockEmployees[0]);
      expect(mockSetIsFormOpen).toHaveBeenCalledWith(true);
    }
  });
});
