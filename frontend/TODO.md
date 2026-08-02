# Register Page

## Steps

- [x] 1. Create `src/auth/shared/AuthCard.tsx` (extracted from LoginCard)
- [x] 2. Create `src/auth/shared/FieldError.tsx` (extracted from LoginForm)
- [x] 3. Update `LoginCard.tsx` to delegate to AuthCard
- [x] 4. Update `LoginForm.tsx` to use shared FieldError
- [x] 5. Update `LoginPreview.tsx` to accept headline/description props
- [x] 6. Add `registerFormSchema` + register constants to `auth.constants.ts`
- [x] 7. Add `RegisterFormValues` to `auth.types.ts`
- [x] 8. Create `useRegisterForm.ts`
- [x] 9. Create Register components (Page, Card, Header, Form, index)
- [x] 10. Update `AppRouter.tsx`; delete old `pages/RegisterPage.tsx`
- [ ] 11. Run typecheck, lint, build, dev check
