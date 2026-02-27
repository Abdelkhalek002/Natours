# Tasks: Responsive Vanilla CSS

**Input**: Design documents from `/specs/001-responsive-vanilla-css/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/responsive-layout.md

**Organization**: Tasks are grouped by user story (Mobile, Tablet, Desktop) to enable incremental delivery and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify baseline configuration and initialize tokens.

- [x] T001 Verify viewport meta tag exists in `views/base.pug`
- [x] T002 Define responsive CSS variables (breakpoints, fluid container) in `:root` of `public/css/style.css`
- [x] T003 [P] Add global responsive reset for `img`, `video`, `iframe` in `public/css/style.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor global layout units to fluid sizing.

- [x] T004 Refactor `.container` to use fluid `max-width` and `padding` in `public/css/style.css`
- [x] T005 Convert fixed `px` or `rem` widths of main sections to `%` or `vw` in `public/css/style.css`
- [x] T006 Implement base fluid typography using `clamp()` for `h1` and `h2` in `public/css/style.css`

---

## Phase 3: User Story 1 - Mobile-First Access (Priority: P1) 🎯 MVP

**Goal**: Every page is usable at 320px with stacked layouts and zero horizontal overflow.

**Independent Test**: Page renders at 320px without overflow; sections stack vertically; navigation is accessible.

### Implementation for User Story 1

- [x] T007 [US1] Set default `.card-container` to `grid-template-columns: 1fr` for mobile in `public/css/style.css`
- [x] T008 [US1] Refactor `.section-description` to `flex-direction: column` as the mobile base in `public/css/style.css`
- [x] T009 [US1] Refactor `.header` to a mobile-friendly vertical layout (if needed) or condensed horizontal in `public/css/style.css`
- [x] T010 [US1] Adjust `.main` padding for small viewports in `public/css/style.css`
- [x] T011 [US1] Ensure all buttons and links meet 44x44px touch target guidelines in `public/css/style.css`

---

## Phase 4: User Story 2 - Tablet Layout Adaptation (Priority: P2)

**Goal**: Optimize space for 600px - 1024px widths using multi-column transitions.

**Independent Test**: Layout transitions to 2-column grid at 600px; margins expand; side-by-side elements appear.

### Implementation for User Story 2

- [x] T012 [US2] Add media query for `@media (min-width: 37.5em)` to adjust `.card-container` to 2 columns in `public/css/style.css`
- [x] T013 [US2] Add media query for `@media (min-width: 50em)` to revert `.section-description` to row layout in `public/css/style.css`
- [x] T014 [US2] Refactor `.footer` grid for tablet viewports in `public/css/style.css`

---

## Phase 5: User Story 3 - Full Desktop Experience (Priority: P1)

**Goal**: Preserve premium brand identity on monitors 1200px and above.

**Independent Test**: Layout centers correctly at 1440px+; grid expands to 3 columns; spacing is generous.

### Implementation for User Story 3

- [x] T015 [US3] Add media query for `@media (min-width: 75em)` for full desktop layout in `public/css/style.css`
- [x] T016 [US3] Set `.card-container` to `grid-template-columns: repeat(3, 1fr)` at desktop breakpoint in `public/css/style.css`
- [x] T017 [US3] Validate max-width constraints on `.container` to prevent text stretching on 4K screens in `public/css/style.css`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T018 Run Lighthouse Mobile audit and fix all detected layout/overflow issues
- [ ] T019 Conduct final cross-browser check (Chrome, Safari, Firefox responsive modes)
- [ ] T020 Run `quickstart.md` validation steps across all breakpoints

---

## Dependencies & Execution Order

1. **Setup & Foundation** (T001-T006) must be completed first.
2. **US1 (Mobile)** (T007-T011) is the MVP and should be completed and tested before Tablet/Desktop.
3. **US2 & US3** can proceed in sequence to build upon the mobile foundation.
