import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeFilters from '../../src/components/employees/EmployeeFilters';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

// Mock api config loader
jest.mock('../../src/lib/api', () => {
  return {
    api: {
      get: jest.fn(),
    },
    getSystemConfig: jest.fn().mockResolvedValue({
      countries: [
        { code: 'US', name: 'United States', currency: 'USD' },
        { code: 'IN', name: 'India', currency: 'INR' },
        { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
        { code: 'DE', name: 'Germany', currency: 'EUR' },
      ],
      departments: ['Engineering', 'Marketing', 'Product'],
    }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
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

  const renderWithClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders search input and dropdown selectors correctly', () => {
    renderWithClient(<EmployeeFilters {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Search by name, ID or email...')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-select')).toHaveLength(4);
  });

  it('calls setSearch when typing in search input', () => {
    renderWithClient(<EmployeeFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, ID or email...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    expect(mockSetSearch).toHaveBeenCalledWith('Alice');
  });

  it('calls clearFilters when clicking the clear filters button', () => {
    renderWithClient(<EmployeeFilters {...defaultProps} />);
    
    const clearBtn = screen.getByRole('button', { name: /Clear Filters/i });
    fireEvent.click(clearBtn);

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });

  it('triggers setCountry / setDepartment / setEmploymentType / setStatus callbacks when select options change', () => {
    renderWithClient(<EmployeeFilters {...defaultProps} />);
    
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
