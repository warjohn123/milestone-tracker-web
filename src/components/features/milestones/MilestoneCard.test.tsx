import { render, screen } from '@testing-library/react';
import MilestoneCard from './MilestoneCard';
import type { IMilestone } from '../../../@types/Milestone';

describe('MilestoneCard', () => {
  const milestone: IMilestone = {
    id: '1',
    title: 'Test Milestone',
    dueDate: '2025-09-30',
    status: 'Pending',
  };

  it('renders milestone title, due date, and status', () => {
    render(<MilestoneCard {...milestone} />);
    expect(screen.getByText('Test Milestone')).toBeInTheDocument();
    expect(screen.getByText('Due: 2025-09-30')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
