# Login Page Implementation

## Steps

- [x] 1. Create auth types (`src/types/auth.types.ts`)
- [x] 2. Create auth constants (`src/constants/auth.constants.ts`)
- [x] 3. Create zod resolver utility (`src/lib/zod-resolver.ts`)
- [x] 4. Create `useLoginForm` hook (`src/hooks/useLoginForm.ts`)
- [x] 5. Create reusable `Input` component (`src/components/ui/input.tsx`)
- [x] 6. Create `auth/login` components (`RememberMe`, `LoginHeader`, `LoginForm`, `LoginCard`, `LoginPreview`, `LoginPage`, `index`)
- [x] 7. Create layouts (`PublicLayout`, `DashboardLayout`)
- [x] 8. Create pages (`RegisterPage`, `DashboardPage`)
- [x] 9. Create router (`AppRouter`)
- [x] 10. Update `App.tsx` to use `AppRouter`
- [x] 11. Update `FoundationStatusPage` to remove manual Navbar/Footer
- [x] 12. Run typecheck and lint

## Verification

- [x] `npm run typecheck` — passes
- [x] `npm run build` — production build succeeds
- [x] `npm run lint` — only 2 pre-existing errors in `useTypingAnimation.ts` / `useTimeline.ts` (not from this feature)
