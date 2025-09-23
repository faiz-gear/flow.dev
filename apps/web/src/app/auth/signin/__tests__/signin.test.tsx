import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignInPage from '../page';
import { signIn } from '../actions';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the server action
jest.mock('../actions', () => ({
  signIn: jest.fn(),
}));

// Mock HeroUI components
jest.mock('@heroui/react', () => ({
  Button: ({ children, isLoading, isDisabled, className, type, ...props }: any) => (
    <button disabled={isLoading || isDisabled} className={className} type={type}>
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Input: ({ label, errorMessage, isInvalid, onChange, value, type, endContent, placeholder, ...props }: any) => (
    <div>
      <label htmlFor={`input-${label}`}>{label}</label>
      <input
        id={`input-${label}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {endContent}
      {isInvalid && errorMessage && <span role="alert">{errorMessage}</span>}
    </div>
  ),
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardBody: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <span>Eye</span>,
  EyeOff: () => <span>EyeOff</span>,
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders sign-in form with all required fields', () => {
    render(<SignInPage />);

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Welcome back! Please sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates password is not empty', async () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Enter valid email but empty password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('disables submit button when form is invalid', () => {
    render(<SignInPage />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Button should be disabled when form is empty
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form is valid', () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Enter valid credentials
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('toggles password visibility', () => {
    render(<SignInPage />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('toggle password visibility');

    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle button again
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls signIn action with form data on submit', async () => {
    (signIn as jest.Mock).mockResolvedValue(undefined);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Enter valid credentials
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('displays error message when sign-in fails', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid email or password' });

    render(<SignInPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Enter valid credentials
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('clears errors when user modifies input', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid email or password' });

    render(<SignInPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Submit with invalid data to generate error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    // Modify email input - error should clear
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    await waitFor(() => {
      expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
    });
  });
});