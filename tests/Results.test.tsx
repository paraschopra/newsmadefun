import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Results from '../components/Results';

describe('Results', () => {
  const props = {
    isCorrect: true,
    realHeadline: 'Scientists discover new planet',
    fakeHeadline: 'Aliens open first intergalactic coffee shop',
    explanation: 'The real headline is from NASA, the fake is AI-generated.',
    onPlayAgain: jest.fn(),
  };

  it('shows whether the user was correct', () => {
    render(<Results {...props} />);
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
  });

  it('shows the real and fake headlines', () => {
    render(<Results {...props} />);
    expect(screen.getByText(props.realHeadline)).toBeInTheDocument();
    expect(screen.getByText(props.fakeHeadline)).toBeInTheDocument();
  });

  it('shows an explanation', () => {
    render(<Results {...props} />);
    expect(screen.getByText(props.explanation)).toBeInTheDocument();
  });

  it('renders a Play Again button', () => {
    render(<Results {...props} />);
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument();
  });
}); 