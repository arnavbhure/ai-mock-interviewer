import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/auth/login";
import { RegisterPage } from "@/auth/register";
import { VerifyOtpPage } from "@/auth/verify-otp";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { FoundationStatusPage } from "@/pages/FoundationStatusPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<FoundationStatusPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<FoundationStatusPage />} />
      </Route>
    </Routes>
  );
}

