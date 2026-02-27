# Implementation Plan: Responsive Vanilla CSS

**Branch**: `001-responsive-vanilla-css` | **Date**: 2026-02-27 | **Spec**: [spec.md](file:///e:/01-Computer-Science/web-dev/03-backend-dev/projects/portfolio-projects/Natours/specs/001-responsive-vanilla-css/spec.md)
**Input**: Feature specification from `/specs/001-responsive-vanilla-css/spec.md`

## Summary
Refactor `public/css/style.css` to implement a mobile-first, fluid responsive design using vanilla CSS. Primary changes involve replacing fixed grid columns with adaptive ones, refactoring `flex-basis` values to stack on smaller viewports, and adjusting typography using media queries or `clamp()`.

## Technical Context
**Language/Version**: CSS3 (Vanilla)
**Primary Dependencies**: None (Standard CSS features only)
**Storage**: N/A
**Testing**: Manual Browser Verification / Lighthouse
**Target Platform**: Modern Web Browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: Web Application
**Performance Goals**: Lighthouse Core Web Vitals (LCP/CLS) within passing range for mobile.
**Constraints**: No external CSS libraries or preprocessors allowed.
**Scale/Scope**: Entire frontend (Public tours, User profile, Login/Signup).

## Constitution Check
*GATE: Passed. Implementation follows plain CSS requirement and mobile-first principles.*

## Project Structure

### Documentation (this feature)
```text
specs/001-responsive-vanilla-css/
├── plan.md              # This file
├── research.md          # Phase 0 results
├── data-model.md        # Responsive tokens/breakpoints
├── quickstart.md        # Verification guide
├── contracts/           # Layout expectations
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)
```text
public/
└── css/
    └── style.css        # MAIN TARGET: Refactor mobile-first

views/                   # REFERENCE: Ensure class matches
├── base.pug             # Base layout
├── tour.pug             # Tour details
├── overview.pug         # Homepage/Tours list
└── ...
```

**Structure Decision**: Option 2: Web application (Single target CSS file in `public/css/style.css`).

## Proposed Changes

### `public/css/style.css`
- **Mobile Foundation**: Clear out large fixed widths (`120rem` containers, etc.) or wrap them in desktop media queries.
- **Breakpoints**: Implement standard breakpoints (`600px`, `900px`, `1200px`) using `@media` queries at the end of the file or inline for components.
- **Grid Refactor**: Alter `.card-container` to use `repeat(auto-fit, minmax(30rem, 1fr))` or direct media query overrides for `grid-template-columns`.
- **Flexbox Refactor**: Change `.section-description` to `flex-direction: column` on mobile.

## Verification Plan

### Automated Tests
*None available for frontend CSS styles in this project.*

### Manual Verification
1. **Device Simulation**:
   - Open browser DevTools.
   - Cycle through widths: `320px`, `375px`, `768px`, `1024px`, `1440px`.
2. **Key Visual Checks**:
   - **Header**: Ensure logo and nav items don't overlap.
   - **Grid**: Verify tour cards stack to 1 column at `< 600px`.
   - **Typography**: Check readability of primary headings on `320px`.
3. **Lighthouse Report**:
   - Run a Mobile Lighthouse audit.
   - Target: "Best Practices" > 90, "Accessibility" > 90.
