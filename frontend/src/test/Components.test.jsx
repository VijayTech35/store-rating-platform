import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { EmptyState, ErrorState } from '../components/EmptyState';
import Modal from '../components/Modal';
import { Skeleton, SkeletonCard, SkeletonTable } from '../components/Skeleton';
import { HiOfficeBuilding } from 'react-icons/hi';

const renderWithTheme = (ui) => render(<MemoryRouter><ThemeProvider>{ui}</ThemeProvider></MemoryRouter>);

describe('EmptyState', () => {
  it('renders title and message', () => {
    renderWithTheme(<EmptyState title="No items" message="Nothing to show." />);
    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('Nothing to show.')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    renderWithTheme(<EmptyState icon={HiOfficeBuilding} title="Custom Title" message="Custom message" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renders error message', () => {
    renderWithTheme(<ErrorState message="Something broke" />);
    expect(screen.getByText('Something broke')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders retry button when onRetry provided', () => {
    renderWithTheme(<ErrorState message="Error" onRetry={() => {}} />);
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});

describe('Modal', () => {
  it('renders content when open', () => {
    renderWithTheme(<Modal open={true} title="Confirm" onClose={() => {}}><p>Modal content</p></Modal>);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithTheme(<Modal open={false} title="Confirm" onClose={() => {}}><p>Hidden</p></Modal>);
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });
});

describe('Skeleton', () => {
  it('renders with aria-label', () => {
    renderWithTheme(<Skeleton rows={3} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('SkeletonCard', () => {
  it('renders loading state', () => {
    renderWithTheme(<SkeletonCard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('SkeletonTable', () => {
  it('renders with accessible label', () => {
    renderWithTheme(<SkeletonTable rows={3} cols={4} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
