# Research: Responsive Vanilla CSS

## Decision: Mobile-First Plain CSS Refactor

We will refactor `public/css/style.css` to follow a mobile-first approach using media queries for larger viewports. We will replace fixed widths and rigid grid definitions with fluid alternatives.

## Findings & Layout Issues

### Global
- Viewport Meta Tag: **Already present** in `views/base.pug`.
- Base Font Size: Using `62.5%` (10px baseline), which is good for `rem` calculations.
- Padding: `body` has `padding: 2rem` (line 35) which might be too much on 320px screens.

### Navigation & Header
- Already has some media queries at `62.5em` (1000px) and `37.5em` (600px).
- Issue: On very small screens, the nav elements might still overlap or wrap awkwardly if not further optimized.

### Card Grid (`.card-container`)
- **Current**: `grid-template-columns: repeat(3, 1fr)` (line 1076).
- **Issue**: 3 columns on mobile will break.
- **Solution**: Change to `1fr` for mobile, `1fr 1fr` for tablet, and `1fr 1fr 1fr` for desktop.

### Flexbox Sections (`.section-description`)
- **Current**: `flex: 0 0 50%` (line 442).
- **Issue**: Side-by-side content is too narrow on mobile.
- **Solution**: Stack vertically on mobile (`flex: 0 0 100%`) and switch to `50%` on tablet/desktop.

### Forms & Modals
- `.login-form`, `.signup-form` have `max-width: 55rem`. 
- Issue: On 320px screens (32rem), `55rem` is fine as a *max*, but we must ensure `width: 100%` or similar is applied so it doesn't overflow if the parent isn't constraining it enough (though it usually is in a flex container).

### Typography
- Titles like `.heading-primary` (5rem) are too large for mobile.
- **Solution**: Use `clamp()` or media queries to scale font sizes.

## Rationale
Using Vanilla CSS (Flexbox/Grid/Media Queries) ensures zero dependencies and maintains the "Plain CSS" requirement. Mobile-first approach simplifies the baseline styles and naturally scales to larger viewports.

## Alternatives Considered
- **Sass/SCSS**: Rejected due to hard constraint of "Plain CSS" and no preprocessors.
- **CSS Frameworks (Tailwind/Bootstrap)**: Rejected due to hard constraint.
- **JS-based layouts**: Rejected due to hard constraint.
