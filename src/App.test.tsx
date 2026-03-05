import { render, screen } from '@testing-library/react';
import App from './App';
import { fetchVehicles } from './services/vehiclesService';

jest.mock('./services/vehiclesService');

beforeEach(() => {
  (fetchVehicles as jest.MockedFunction<typeof fetchVehicles>).mockReturnValue(
    new Promise(() => {})
  );
});

it('renders the heading and main landmark', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /tanks/i })).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
});
