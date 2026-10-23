# Happy Joy

A cozy mini-game web app built with Next.js, TypeScript, and Tailwind CSS.

Happy Joy is a personal project focused on creating small, playful browser experiences that are simple, relaxing, and fun. The current featured game is **Friend Quest**.

## Live Demo

https://happy-joy.vercel.app

## Features

### Friend Quest

- Interactive yes/no game flow
- Dynamic dialogue and character reactions
- Friendship meter progression
- Randomized final responses
- Animated button and visual feedback
- Responsive layout
- Keyboard-accessible interactions
- Reduced-motion support

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier

## Project Structure

- `src/app` — application routes and pages
- `src/components` — reusable UI components
- `src/hooks` — reusable interaction hooks
- `src/lib` — game logic, shared data, and types
- `src/styles` — global styles and animations
- `public/images` — project and game assets

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Create a production build:

```bash
npm run build
```

## Testing and Quality Checks

Happy Joy uses [Vitest](https://vitest.dev/) for unit testing and GitHub Actions for continuous integration.

### Run checks locally

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

### Unit testing

Unit tests are colocated with their source files using the `.test.ts` naming convention.

The current test suite covers Friend Quest's core game logic, including:

- No button scaling and minimum size
- Illustration progression and index boundaries
- Dialogue transitions and ending-state precedence
- Final-ending selection, including controlled randomized outcomes
- Utility and character animation-state logic

### Continuous integration

Pull requests targeting `main` automatically trigger a GitHub Actions workflow that installs dependencies and runs linting, TypeScript checking, unit tests, and a production build.

Browser interactions, visual presentation, keyboard navigation, and screen-reader behavior are not currently covered by automated tests and still require manual verification.

## Project Status

Happy Joy currently features **Friend Quest**, with additional mini-games planned for future development.

## Acknowledgements

- Icons provided by [Font Awesome](https://fontawesome.com/).
- Project images were generated with ChatGPT.
- ChatGPT was also used throughout development for brainstorming, design feedback, debugging support, accessibility improvements, and code review.
