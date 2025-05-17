import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from '../components/Landing';

describe('Landing', () => {
  it('renders the main title', () => {
    render(<Landing />);
    expect(screen.getByRole('heading', { name: /news made fun/i })).toBeInTheDocument();
  });

  it('renders a brief description', () => {
    render(<Landing />);
    expect(screen.getByText(/can you spot the fake news/i)).toBeInTheDocument();
  });

  it('renders a Start Game button', () => {
    render(<Landing />);
    expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument();
  });
}); 