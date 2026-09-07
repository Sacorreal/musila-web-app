# CLAUDE.md — musila-web-app

Guidance for the Next.js frontend. Loaded when working under `musila-web-app/`.

## UI/UX & Component Quality Standards

**MANDATORY**: Every UI component created or modified in this project must meet premium quality standards:

### Design & Visual Quality
- Use refined animations and micro-interactions (Framer Motion preferred; CSS transitions as fallback)
- Apply consistent spacing, typography hierarchy, and visual rhythm across all components
- Support dark/light mode natively using Tailwind CSS variables or CSS custom properties
- Use glassmorphism, subtle gradients, and depth when appropriate to the design context
- Every interactive element must have clear hover, focus, active, and disabled states

### Performance
- Components must be code-split and lazy-loaded when not above the fold
- Avoid unnecessary re-renders — memoize with `React.memo`, `useMemo`, `useCallback` where justified
- Images must use `next/image` with proper `sizes` and `priority` attributes
- Skeleton loaders are required for every async data-dependent component
- No layout shift (CLS) — reserve space for dynamic content

### Accessibility (a11y)
- All interactive elements must be keyboard-navigable and have proper `aria-*` attributes
- Color contrast must meet WCAG AA minimum (4.5:1 for text)
- Focus rings must be visible and styled (never `outline: none` without a replacement)

### UX Patterns
- Loading, empty, and error states are required for every data-fetching component
- Forms must give real-time inline validation feedback using react-hook-form + Zod schemas
- Destructive actions must always require confirmation (modal or popover)
- Toast/snackbar notifications for all async action outcomes (success & error)

### Code Standards
- Extract reusable UI primitives to `src/shared/components/ui/`
- Compose complex components from smaller, single-responsibility pieces
- Props interfaces must be explicit — no `any`, no implicit `children` without `React.PropsWithChildren`
