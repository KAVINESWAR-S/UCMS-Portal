import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout, AuthLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth Pages
import { AadhaarLogin } from './pages/auth/AadhaarLogin';
import { OfficerLogin } from './pages/auth/OfficerLogin';
import { AdminLogin } from './pages/auth/AdminLogin';
import { VerifyCertificate } from './pages/public/VerifyCertificate';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { MyProfile } from './pages/citizen/MyProfile';
import { RecommendedSchemes } from './pages/citizen/RecommendedSchemes';
import { SchemeDetails } from './pages/citizen/SchemeDetails';
import { ApplyScheme } from './pages/citizen/ApplyScheme';
import { MyApplications } from './pages/citizen/MyApplications';
import { ApplicationDetails } from './pages/citizen/ApplicationDetails';
import { Certificates } from './pages/citizen/Certificates';
import { ServiceRequests } from './pages/citizen/ServiceRequests';
import { Grievances } from './pages/citizen/Grievances';
import { Suggestions } from './pages/citizen/Suggestions';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerApplications } from './pages/officer/OfficerApplications';
import { OfficerApplicationDetails } from './pages/officer/OfficerApplicationDetails';
import { OfficerCertificates } from './pages/officer/OfficerCertificates';
import { OfficerServiceRequests } from './pages/officer/OfficerServiceRequests';
import { OfficerGrievances } from './pages/officer/OfficerGrievances';
import { OfficerSuggestions } from './pages/officer/OfficerSuggestions';
import { VillageDashboard } from './pages/officer/VillageDashboard';
import { DevelopmentWorks } from './pages/officer/DevelopmentWorks';
import { BudgetTransparency } from './pages/officer/BudgetTransparency';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VillageManagement } from './pages/admin/VillageManagement';
import { OfficerManagement } from './pages/admin/OfficerManagement';
import { CitizenManagement } from './pages/admin/CitizenManagement';
import { ApplicationManagement } from './pages/admin/ApplicationManagement';
import { CertificateManagement } from './pages/admin/CertificateManagement';
import { BudgetManagement } from './pages/admin/BudgetManagement';
import { DevelopmentWorks as AdminDevelopmentWorks } from './pages/admin/DevelopmentWorks';
import { SchemeManagement } from './pages/admin/SchemeManagement';
import { GrievanceManagement } from './pages/admin/GrievanceManagement';
import { AiFraudMonitoring } from './pages/admin/AiFraudMonitoring';
import { AuditLogs } from './pages/admin/AuditLogs';
import { Reports as AdminReports } from './pages/admin/Reports';

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'OFFICER') return <Navigate to="/officer/dashboard" replace />;
  return <Navigate to="/citizen/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root Navigation Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth & Public Routes */}
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<AadhaarLogin />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />
            <Route path="/officer/login" element={<OfficerLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* Citizen Protected Routes */}
          <Route element={<ProtectedRoute allowedRole="CITIZEN" />}>
            <Route element={<MainLayout />}>
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/profile" element={<MyProfile />} />
              <Route path="/citizen/schemes" element={<RecommendedSchemes />} />
              <Route path="/citizen/schemes/:id" element={<SchemeDetails />} />
              <Route path="/citizen/apply/:id" element={<ApplyScheme />} />
              <Route path="/citizen/applications" element={<MyApplications />} />
              <Route path="/citizen/applications/:id" element={<ApplicationDetails />} />
              <Route path="/citizen/certificates" element={<Certificates />} />
              <Route path="/citizen/service-requests" element={<ServiceRequests />} />
              <Route path="/citizen/grievances" element={<Grievances />} />
              <Route path="/citizen/suggestions" element={<Suggestions />} />
            </Route>
          </Route>

          {/* Officer Protected Routes */}
          <Route element={<ProtectedRoute allowedRole="OFFICER" />}>
            <Route element={<MainLayout />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/officer/applications" element={<OfficerApplications />} />
              <Route path="/officer/applications/:id" element={<OfficerApplicationDetails />} />
              <Route path="/officer/certificates" element={<OfficerCertificates />} />
              <Route path="/officer/service-requests" element={<OfficerServiceRequests />} />
              <Route path="/officer/grievances" element={<OfficerGrievances />} />
              <Route path="/officer/suggestions" element={<OfficerSuggestions />} />
              <Route path="/officer/village" element={<VillageDashboard />} />
              <Route path="/officer/development-works" element={<DevelopmentWorks />} />
              <Route path="/officer/budget" element={<BudgetTransparency />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/villages" element={<VillageManagement />} />
              <Route path="/admin/officers" element={<OfficerManagement />} />
              <Route path="/admin/citizens" element={<CitizenManagement />} />
              <Route path="/admin/applications" element={<ApplicationManagement />} />
              <Route path="/admin/certificates" element={<CertificateManagement />} />
              <Route path="/admin/budgets" element={<BudgetManagement />} />
              <Route path="/admin/development-works" element={<AdminDevelopmentWorks />} />
              <Route path="/admin/schemes" element={<SchemeManagement />} />
              <Route path="/admin/grievances" element={<GrievanceManagement />} />
              <Route path="/admin/ai-fraud" element={<AiFraudMonitoring />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
