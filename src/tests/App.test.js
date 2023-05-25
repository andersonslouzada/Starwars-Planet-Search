import { render, screen } from '@testing-library/react';
import App from '../App';

test('should render App component', () => {
  render(<App />);

  const headingElement = screen.getByText('Star Wars Planets');
  expect(headingElement).toBeInTheDocument();
});
