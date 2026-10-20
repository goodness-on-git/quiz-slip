# QuizSlip

A customizable trivia quiz that looks and feels like a pub-quiz answer slip. Set up a round in one sentence, answer with the mouse or the A–D keys, then review every question.

<!-- TODO: add a screenshot or GIF here, for example: ![QuizSlip](docs/screenshot.png) -->

**Live demo:** <!-- TODO: add your deployed URL -->

## Features

- **Set up a round in one sentence.** Pick the number of questions (1–50), the topic, the difficulty and the format (multiple choice, true or false, or mixed).
- **Answer your way.** Click, tab and use the arrow keys, or press A–D. Jump between questions from the numbered row. Filled numbers are answered, dashed ones are skipped.
- **Resume after a refresh.** The round is kept in `sessionStorage`, so a reload does not lose your place.
- **Review with the answers.** See your score, then open any question to see the correct answer and what you picked. Filter down to the ones you missed.
- **Light and dark themes.** Follows your system setting, remembers your choice, and never flashes the wrong theme on load.
- **Accessible by default.** Real form controls, visible focus, a skip link, focus moves to the new page after navigation, state is never shown by colour alone, and motion is reduced when the system asks for it.

## Tech stack

- [React 19](https://react.dev) and [TypeScript](https://www.typescriptlang.org) (strict mode)
- [Vite](https://vite.dev) for dev and build
- [React Router](https://reactrouter.com) with lazy-loaded pages
- CSS Modules with a small set of design tokens, no UI library
- [Vitest](https://vitest.dev) and Testing Library
- ESLint (with `jsx-a11y`), Prettier, and a GitHub Actions workflow
- Questions from the [Open Trivia DB](https://opentdb.com) API

## Getting started

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

| Command              | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the dev server                |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Serve the production build locally  |
| `npm test`           | Run the tests once                  |
| `npm run test:watch` | Run the tests as you edit           |
| `npm run lint`       | Lint the code                       |
| `npm run format`     | Format the code with Prettier       |
| `npm run typecheck`  | Type-check without building         |

## Project structure

```
src/
  components/   Reusable UI: header, footer, answer rows, dialog, score mark
  constants/    Categories and site details
  context/      Quiz state: reducer, provider, and sessionStorage persistence
  hooks/        Theme, page title, and the question loader
  lib/          Pure helpers: shuffle, scoring, settings, storage
  pages/        One component per route
  services/     The Open Trivia DB client
  styles/       Design tokens and global styles
  types/        Shared TypeScript types
```

## Design and engineering notes

- **State is a reducer.** All quiz rules live in one pure function (`quizReducer`) with a status machine: `setup`, `loading`, `playing`, `finished`, `error`. Invalid transitions are ignored, so a late network response cannot revive a round the player already left.
- **No HTML injection.** Question text arrives percent-encoded (`encode=url3986`) and is decoded to plain strings, so nothing is rendered as HTML.
- **Polite to the API.** Open Trivia DB allows one request every few seconds. Identical requests that overlap share one network call, which also covers React StrictMode running effects twice in development. Errors from the API are turned into plain messages with a retry.
- **Native elements first.** Answers are radio inputs, confirmations use the `<dialog>` element, and the review uses `<details>`. That gives keyboard and screen reader behaviour without extra code.
- **Tested where it matters.** Unit tests cover the reducer, scoring, API client and persistence. Flow tests play a round, handle a failed load, and check the results and review.

## Deployment

The app is a static single-page app, so any static host works. Client-side routes need every path to fall back to `index.html`, and both configs are included.

**Vercel:** import the repository. The build command is `npm run build` and the output directory is `dist`. `vercel.json` handles the route fallback.

**Netlify:** the same build settings apply. `public/_redirects` handles the route fallback.

## Customizing

Add your own name, bio and links in `src/constants/site.ts`. Anything left empty is hidden, so no placeholder text shows up on the About page or in the footer.

## Credits

Questions are provided by the community at [Open Trivia DB](https://opentdb.com) under the [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license.
