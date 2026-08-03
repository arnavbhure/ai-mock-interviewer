# Migration: Sonner → react-hot-toast

## Steps

- [x] Install react-hot-toast, uninstall sonner
- [x] Create src/components/ui/toast/ToastIcon.tsx
- [x] Create src/components/ui/toast/ToastCloseButton.tsx
- [x] Create src/components/ui/toast/ToastCard.tsx (renamed from Toast.tsx to avoid Windows case-collision with toast.tsx)
- [x] Create src/components/ui/toast/toast.tsx (renamed from toast.ts to support JSX)
- [x] Create src/components/ui/toast/ToastProvider.tsx
- [x] Create src/components/ui/toast/index.ts
- [x] Update App.tsx to use <ToastProvider />
- [x] Update axios.ts to use custom helper
- [x] Update useLoginForm.ts
- [x] Update useRegisterForm.ts
- [x] Update useVerifyOtpForm.ts
- [x] Verify no sonner references remain
- [x] Run typecheck/build (passes)
