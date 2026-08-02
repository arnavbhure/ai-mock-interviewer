import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/auth/login";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { FoundationStatusPage } from "@/pages/FoundationStatusPage";
import { RegisterPage } from "@/pages/RegisterPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<FoundationStatusPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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

