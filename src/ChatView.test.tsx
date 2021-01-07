import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatView from './ChatView';

test('renders learn react link', () => {
  render(<ChatView />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
