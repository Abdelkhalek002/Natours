# Responsive Layout Contract

## Viewport Support
The application MUST support viewports from `320px` to `1920px+` without horizontal overflow.

## Breakpoints
| Label | Threshold | Logic |
|-------|-----------|-------|
| Mobile | `< 600px` | Single column, full width elements, stacked nav. |
| Tablet Port | `600px - 900px` | Multi-column (2) where appropriate, condensed margins. |
| Tablet Land | `900px - 1200px` | Multi-column (3), standard margins. |
| Desktop | `> 1200px` | Centered container (`max-width: 120rem`), wide gutters. |

## Component Expectations
- **Header**: Transitions to a mobile menu (hamburger or vertical stack) below `1000px`.
- **Tour Cards**: Transition from 3-columns to 2-columns at `900px`, and 1-column at `600px`.
- **Footer**: Content centers and stacks below `800px`.
