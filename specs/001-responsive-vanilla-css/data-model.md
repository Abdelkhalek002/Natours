# Data Model: Responsive Design Tokens

For this responsive refactor, the "data model" consists of CSS variables (design tokens) that control the fluid layout and breakpoints.

## Breakpoint Tokens

| Token | Value | Range | Use Case |
|-------|-------|-------|----------|
| `--bp-phone` | `37.5em` | `600px` | Small phones |
| `--bp-tab-port` | `56.25em` | `900px` | Portait tablets |
| `--bp-tab-land` | `75em` | `1200px` | Landscape tablets / Small desktop |
| `--bp-desktop` | `112.5em` | `1800px` | Large desktops |

*Note: Breakdown assumes 1rem = 16px for em calculations, but the app uses 62.5% (10px baseline). We will adjust em values based on standard 16px browser default if needed for consistent media query behavior.*

## Fluid Layout Tokens

| Token | Description | Logic |
|-------|-------------|-------|
| `--container-width` | Max width of main content | `min(120rem, 90vw)` |
| `--section-padding` | Vertical padding for sections | Fluid scaled based on viewport |
| `--font-size-hero` | Hero text size | `clamp(3rem, 8vw, 5rem)` |

## Key Layout Components (Entities)

### Navigation
- State: `Vertical` (Mobile) | `Horizontal` (Desktop)
- Attributes: `Logo Position`, `List visibility`, `Auth item spacing`.

### Tour Card
- State: `Full Width` (Mobile) | `Grid Item` (Desktop)
- Attributes: `Image height`, `Padding`, `Button alignment`.

### Form Container
- State: `Full Width` (Mobile) | `Center Constrained` (Desktop)
- Attributes: `Padding`, `Max Width`.
