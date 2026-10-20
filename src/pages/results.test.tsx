import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../App';
import { saveState } from '../context/persistence';
import { QuizProvider } from '../context/QuizProvider';
import { initialState, type QuizState } from '../context/quizReducer';
import type { Question } from '../types/quiz';

const questions: Question[] = [1, 2].map((n) => ({
  text: `Question ${n} text`,
  category: 'Art',
  difficulty: 'easy',
  options: [
    { letter: 'A', text: 'Right', isCorrect: true },
    { letter: 'B', text: 'Wrong', isCorrect: false },
  ],
}));

const finished: QuizState = {
  ...initialState,
  status: 'finished',
  questions,
  // Question 1 right, question 2 left unanswered.
  answers: { 0: 'A' },
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <QuizProvider>
        <AppRoutes />
      </QuizProvider>
    </MemoryRouter>,
  );
}

describe('results page', () => {
  it('shows the score and the percentage', async () => {
    saveState(finished);
    renderAt('/results');
    expect(
      await screen.findByText('You scored 1 out of 2.'),
    ).toBeInTheDocument();
    expect(screen.getByText('50% correct')).toBeInTheDocument();
  });

  it('can narrow the review to missed questions', async () => {
    saveState(finished);
    const user = userEvent.setup();
    renderAt('/results');

    await user.click(await screen.findByRole('button', { name: 'Missed (1)' }));
    expect(screen.getByText('Question 2 text')).toBeInTheDocument();
    expect(screen.queryByText('Question 1 text')).not.toBeInTheDocument();
    expect(screen.getByText('Skipped')).toBeInTheDocument();
  });

  it('goes back to setup with "New quiz"', async () => {
    saveState(finished);
    const user = userEvent.setup();
    renderAt('/results');

    await user.click(await screen.findByRole('button', { name: 'New quiz' }));
    expect(
      await screen.findByRole('button', { name: 'Start quiz' }),
    ).toBeInTheDocument();
  });

  it('sends visitors without a finished round to setup', async () => {
    renderAt('/results');
    expect(
      await screen.findByRole('button', { name: 'Start quiz' }),
    ).toBeInTheDocument();
  });
});

describe('about page', () => {
  it('explains the app', async () => {
    renderAt('/about');
    expect(
      await screen.findByRole('heading', { name: 'About QuizSlip' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Open Trivia DB/)).toBeInTheDocument();
  });
});
