import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilters from '../../src/components/employees/EmployeeFilters';
import '@testing-library/jest-dom';

// Mock UI Select components with native HTML select elements for seamless JSDOM interactions
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

describe('EmployeeFilters Component', () => {
  const mockSetSearch = jest.fn();
  const mockSetCountry = jest.fn();
  const mockSetDepartment = jest.fn();
  const mockSetEmploymentType = jest.fn();
  const mockSetStatus = jest.fn();
  const mockClearFilters = jest.fn();

  const defaultProps = {
    search: '',
    setSearch: mockSetSearch,
    country: '',
    setCountry: mockSetCountry,
    department: '',
    setDepartment: mockSetDepartment,
    employmentType: '',
    setEmploymentType: mockSetEmploymentType,
    status: '',
    setStatus: mockSetStatus,
    clearFilters: mockClearFilters,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and dropdown selectors correctly', () => {
    render(<EmployeeFilters {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Search by name, ID or email...')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-select')).toHaveLength(4);
  });

  it('calls setSearch when typing in search input', () => {
    render(<EmployeeFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, ID or email...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    expect(mockSetSearch).toHaveBeenCalledWith('Alice');
  });

  it('calls clearFilters when clicking the clear filters button', () => {
    render(<EmployeeFilters {...defaultProps} />);
    
    const clearBtn = screen.getByRole('button', { name: /Clear Filters/i });
    fireEvent.click(clearBtn);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });

  it('triggers setCountry / setDepartment / setEmploymentType / setStatus callbacks when select options change', () => {
    render(<EmployeeFilters {...defaultProps} />);
    
    const selectElements = screen.getAllByTestId('mock-select');
    
    // Trigger Country change
    fireEvent.change(selectElements[0], { target: { value: 'US' } });
    expect(mockSetCountry).toHaveBeenCalledWith('US');

    // Trigger Country change to ALL
    fireEvent.change(selectElements[0], { target: { value: 'ALL' } });
    expect(mockSetCountry).toHaveBeenCalledWith('');

    // Trigger Department change
    fireEvent.change(selectElements[1], { target: { value: 'Engineering' } });
    expect(mockSetDepartment).toHaveBeenCalledWith('Engineering');

    // Trigger Employment Type change
    fireEvent.change(selectElements[2], { target: { value: 'FULL_TIME' } });
    expect(mockSetEmploymentType).toHaveBeenCalledWith('FULL_TIME');

    // Trigger Status change
    fireEvent.change(selectElements[3], { target: { value: 'ACTIVE' } });
    expect(mockSetStatus).toHaveBeenCalledWith('ACTIVE');
  });
});
