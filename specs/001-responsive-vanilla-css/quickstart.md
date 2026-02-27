# Quickstart: Responsive CSS Verification

## Development Environment
1. Ensure `npm run start` is running to serve the application.
2. Open `http://localhost:3000` (or the local dev URL).

## Verification Steps
1. **Responsive Toggle**: Use Chrome DevTools (Ctrl+Shift+M) to toggle device toolbar.
2. **Preset Widths**:
   - Set width to `320px` (iPhone SE).
   - Set width to `768px` (iPad).
   - Set width to `1024px` (iPad Pro).
   - Set width to `1440px` (Laptop).
3. **Check Items**:
   - Ensure the header logo and nav items don't overlap.
   - Verify that the three cards in the tours section stack vertically at `600px` and below.
   - Ensure the footer content is centered on mobile.
   - Run a Lighthouse report in the "Mobile" category and check the "Best Practices" for viewport/accessibility.
