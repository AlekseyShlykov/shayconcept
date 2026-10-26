# AGENTS.md

## Project

A minimalist, black-and-white scrollytelling portfolio website for Shay, featuring scroll-driven animations and an interactive three-question diagnostic.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- GSAP + ScrollTrigger for scroll animations
- Lucide React for icons
- Static deployment on GitHub Pages

## Development Rules

- All website content must be in English.
- Keep the design minimalist, editorial, and strictly monochrome.
- Prioritize smooth animations, performance, accessibility, and responsive layouts.
- Use reusable components and clean, maintainable code.
- Keep questionnaire questions, answers, scoring logic, and result texts in separate editable data files.
- Support `prefers-reduced-motion`.
- Avoid unnecessary dependencies and overengineering.
- Do not add features or sections beyond the specification unless necessary for functionality.

## GitHub Pages Requirements

- The website must work as a fully static application.
- Do not use Next.js, server-side rendering, or server-only features.
- Configure Vite's `base` path correctly for GitHub Pages. Support both custom domains and repository subpaths.
- Use relative asset paths compatible with GitHub Pages.
- Avoid client-side routing that requires server rewrites. Use section anchors where possible.
- Configure automatic deployment through GitHub Actions.
- Ensure `npm run build` generates a deployable `dist/` directory.

## Questionnaire and Data

- The questionnaire must work entirely client-side.
- Email validation and result calculation happen in the browser.
- GitHub Pages cannot process or store form submissions.
- Use an external form service or serverless API endpoint for lead collection, configured via environment variables.
- Never put API secrets in frontend code.
- Never expose personal data in URLs or analytics.
- Show submission success only after receiving confirmation from the external service.

## Quality Checks

Before finishing any task:

1. Run `npm run build`.
2. Check responsive behavior.
3. Verify scroll animations and reverse scrolling.
4. Test all questionnaire paths and result calculations.
5. Confirm GitHub Pages compatibility.
6. Check browser console for errors.

## Working Principles

- Make changes directly instead of only describing them.
- Prefer simple, reliable implementations.
- Preserve existing functionality when modifying code.
- Keep the README updated with setup, deployment, and form integration instructions.
- Do not claim functionality is tested unless the relevant checks have actually been performed.