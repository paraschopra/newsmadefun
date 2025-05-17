import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from '../components/Game';

describe('Game', () => {
  const mockHeadlines = [
    { id: 1, text: 'Real headline: Scientists discover new planet', isReal: true },
    { id: 2, text: 'Fake headline: Aliens open first intergalactic coffee shop', isReal: false },
  ];

  it('renders a pair of headlines', () => {
    render(<Game headlines={mockHeadlines} onSubmit={() => {}} />);
    expect(screen.getByText(/scientists discover new planet/i)).toBeInTheDocument();
    expect(screen.getByText(/aliens open first intergalactic coffee shop/i)).toBeInTheDocument();
  });

  it('allows the user to select a headline', () => {
    render(<Game headlines={mockHeadlines} onSubmit={() => {}} />);
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    expect(options[0]).toBeChecked();
  });

  it('renders a Submit button', () => {
    render(<Game headlines={mockHeadlines} onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
}); 