import { render, screen } from '@testing-library/react';

describe('skeleton', () => {
  it('renders the placeholder heading', () => {
    render(<h1>Моніторинг обстановки</h1>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
