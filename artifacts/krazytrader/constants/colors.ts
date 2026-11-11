/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#182230',
    tint: '#174B9B',

    // Core surfaces
    background: '#EEF1F5',
    foreground: '#182230',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#182230',

    // Primary action color (buttons, links, active states)
    primary: '#174B9B',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E3EAF4',
    secondaryForeground: '#174B9B',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#E4E8EE',
    mutedForeground: '#667085',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#A6D93D',
    accentForeground: '#182230',

    // Destructive actions (delete, error states)
    destructive: '#B42318',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#DCE2E9',
    input: '#DCE2E9',
    success: '#16803C',
    successSoft: '#E7F5EB',
    warning: '#9A6700',
    warningSoft: '#FFF4D6',
    lime: '#A6D93D',
    limeSoft: '#F0F8DE',
    scrim: 'rgba(24,34,48,0.42)',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;
