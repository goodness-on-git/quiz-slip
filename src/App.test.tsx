import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './App';
import { QuizProvider } from './context/QuizProvider';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <QuizProvider>
        <AppRoutes />
      </QuizProvider>
    </MemoryRouter>,
  );
}

describe('app shell', () => {
  it('shows the home page with the site navigation', async () => {
    renderAt('/');
    expect(
      await screen.findByRole('heading', { name: 'Set up your quiz' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'QuizSlip' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Play' })).toBeInTheDocument();
  });

  it('shows a helpful page for unknown addresses', async () => {
    renderAt('/nope');
    expect(
      await screen.findByRole('heading', { name: /that page doesn.t exist/i }),
    ).toBeInTheDocument();
  });

  it('navigates with the header links', async () => {
    renderAt('/');
    await userEvent.click(await screen.findByRole('link', { name: 'About' }));
    expect(
      await screen.findByRole('heading', { name: 'About QuizSlip' }),
    ).toBeInTheDocument();
  });

  it('switches the theme and remembers it', async () => {
    document.documentElement.dataset.theme = 'light';
    renderAt('/');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Switch to dark theme' }),
    );
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('quizslip:theme')).toBe('dark');
    expect(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument();
  });
});
