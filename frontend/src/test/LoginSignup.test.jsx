import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Login Page', () => {
  it('renders login form with heading', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/Sign up/)).toBeInTheDocument();
  });
});

describe('Signup Page', () => {
  it('renders signup form with heading', () => {
    renderWithProviders(<Signup />);
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderWithProviders(<Signup />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders password requirements checklist', () => {
    renderWithProviders(<Signup />);
    expect(screen.getByText('8-16 characters')).toBeInTheDocument();
    expect(screen.getByText('At least 1 uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('At least 1 special character')).toBeInTheDocument();
  });

  it('renders create account button', () => {
    renderWithProviders(<Signup />);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
