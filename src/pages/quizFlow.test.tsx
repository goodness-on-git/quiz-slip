import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../App';
import { QuizProvider } from '../context/QuizProvider';

function apiQuestion(n: number) {
  return {
    type: 'multiple',
    difficulty: 'easy',
    category: 'General%20Knowledge',
    question: `Question%20${n}%20text`,
    correct_answer: 'Right',
    incorrect_answers: ['Wrong%201', 'Wrong%202', 'Wrong%203'],
  };
}

function mockTrivia(body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => body,
    })),
  );
}

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <QuizProvider>
        <AppRoutes />
      </QuizProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('quiz flow', () => {
  it('plays a round from setup to the finish dialog', async () => {
    mockTrivia({ response_code: 0, results: [apiQuestion(1), apiQuestion(2)] });
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('button', { name: 'Start quiz' }));

    // First question appears with its options.
    expect(
      await screen.findByRole('heading', { name: 'Question 1 text' }),
    ).toBeInTheDocument();
    expect(screen.getByText('0 of 2 answered')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Right' }));
    expect(screen.getByText('1 of 2 answered')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      await screen.findByRole('heading', { name: 'Question 2 text' }),
    ).toBeInTheDocument();

    // On the last question, finishing asks for confirmation first.
    await user.click(screen.getByRole('button', { name: 'Finish quiz' }));
    const dialog = screen.getByRole('dialog', { name: 'Finish the quiz?' });
    expect(
      within(dialog).getByText(/The other 1 will count as wrong/),
    ).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole('button', { name: 'Finish quiz' }),
    );
    expect(
      await screen.findByRole('heading', { name: 'Results' }),
    ).toBeInTheDocument();
  });

  it('shows a plain message and a retry when loading fails', async () => {
    mockTrivia({ response_code: 1, results: [] });
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByRole('button', { name: 'Start quiz' }));

    expect(
      await screen.findByRole('heading', {
        name: /couldn.t load your questions/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/aren.t enough questions/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });

  it('sends visitors back to setup when they open the quiz directly', async () => {
    render(
      <MemoryRouter initialEntries={['/quiz']}>
        <QuizProvider>
          <AppRoutes />
        </QuizProvider>
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole('button', { name: 'Start quiz' }),
    ).toBeInTheDocument();
  });
});
