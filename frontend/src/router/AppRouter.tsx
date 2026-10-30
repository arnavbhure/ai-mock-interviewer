import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/auth/login";
import { RegisterPage } from "@/auth/register";
import { VerifyOtpPage } from "@/auth/verify-otp";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { FoundationStatusPage } from "@/pages/FoundationStatusPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SetupInterviewPage } from "@/pages/SetupInterviewPage";
import { InterviewPage } from "@/pages/InterviewPage";
import { DSAInterviewPage } from "@/pages/DSAInterviewPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { InterviewsPage } from "@/pages/InterviewsPage";
import { ProgressPage } from "@/pages/ProgressPage";
import { HelpPage } from "@/pages/HelpPage";
import { SettingsPage } from "@/pages/SettingsPage";
import ProtectedRoute from "./ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<FoundationStatusPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/interview/dsa" element={<DSAInterviewPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/new" element={<SetupInterviewPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:interviewId" element={<ReportsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
