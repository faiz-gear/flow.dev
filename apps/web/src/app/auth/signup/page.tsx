'use client';

import { useState } from 'react';
import { Button, Input, Card, CardHeader, CardBody } from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from './actions';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (errors.email) {
      if (validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }

    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (errors.password) {
      if (validatePassword(value)) {
        setErrors(prev => ({ ...prev, password: undefined }));
      }
    }

    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await signUp(formData);

    if (result?.error) {
      setErrors({ general: result.error });
      setIsLoading(false);
    }
    // If successful, the server action will redirect to dashboard
  };

  const isFormValid = validateEmail(email) && validatePassword(password);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-semibold">Sign Up</h1>
          <p className="text-sm text-default-500">Create your account to get started</p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              variant="bordered"
              isRequired
            />

            <Input
              type={isPasswordVisible ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              variant="bordered"
              isRequired
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label="toggle password visibility"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-5 h-5 text-default-400 pointer-events-none" />
                  ) : (
                    <Eye className="w-5 h-5 text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            {errors.general && (
              <div className="text-sm text-danger">{errors.general}</div>
            )}

            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              isDisabled={!isFormValid || isLoading}
              className="w-full"
            >
              Sign Up
            </Button>

            <p className="text-center text-sm text-default-500">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}