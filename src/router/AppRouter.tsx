import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

// Pages principales
import RoleSelector from '@pages/RoleSelector';

// Admin
import AdminDashboardEnhanced from '@admin/AdminDashboardEnhanced';
import AdminFunctionalCommunication from '@admin/AdminFunctionalCommunication';
import ConfigurationReglesOperationnelles from '@admin/ConfigurationReglesOperationnelles';
import GestionUtilisateurs from '@admin/GestionUtilisateurs';
import MatricePermissionsAvancee from '@admin/MatricePermissionsAvancee';
import SupervisionTechniqueOptimisee from '@admin/SupervisionTechniqueOptimisee';

// Secrétaire principale
import EagleCommunication from '@secretary-primary/EagleCommunication';
import EagleConsultantManagement from '@secretary-primary/EagleConsultantManagement';
import EaglePrincipalDashboard from '@secretary-primary/EaglePrincipalDashboard';
import EagleSallesAttente from '@secretary-primary/EagleSallesAttente';
import EagleUrgencyValidation from '@secretary-primary/EagleUrgencyValidation';
import PerformanceTableau from '@secretary-primary/PerformanceTableau';
import SupervisionDashboard from '@secretary-primary/SupervisionDashboard';

// Médecin
import TableauBordMedecin from '@doctor/TableauBordMedecin';
import DoctorCommunicationCenter from '@doctor/DoctorCommunicationCenter';
import GestionUrgences from '@doctor/GestionUrgences';
import SalleAttenteVirtuelle from '@doctor/SalleAttenteVirtuelle';
import TeleconsultationInterface from '@doctor/TeleconsultationInterface';

// Infirmier
import InfirmierMessagingApp from '@nurse/InfirmierMessagingApp';
import SallePreconsultation from '@nurse/SallePreconsultation';

// Secrétaire secondaire
import SecretaireSMessagingApp from '@secretary-secondary/SecretaireSMessagingApp';

// Partagé
import FormulairePriseRDV from '@shared-admin/FormulairePriseRDV';
import EagleDashboard from '@shared-medical/EagleDashboard';
import GestionUrgencesSecretaire from '@shared-medical/GestionUrgencesSecretaire';
import PostConsultationInterface from '@shared-medical/PostConsultationInterface';
import SoumissionUrgence from '@shared-medical/SoumissionUrgence';
import OfflineManagementInterface from '@shared-technical/OfflineManagementInterface';
import TechnicalMonitoringInterface from '@shared-technical/TechnicalMonitoringInterface';

// === COMPOSANT DE PROTECTION ===
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* === PAGE D'ACCUEIL === */}
        <Route path="/" element={<RoleSelector />} />
        
        {/* ==================== */}
        {/* === ROUTES ADMIN === */}
        {/* ==================== */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardEnhanced />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <GestionUtilisateurs />
          </ProtectedRoute>
        } />
        <Route path="/admin/permissions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MatricePermissionsAvancee />
          </ProtectedRoute>
        } />
        <Route path="/admin/configuration" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ConfigurationReglesOperationnelles />
          </ProtectedRoute>
        } />
        <Route path="/admin/supervision" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SupervisionTechniqueOptimisee />
          </ProtectedRoute>
        } />
        <Route path="/admin/communication" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminFunctionalCommunication />
          </ProtectedRoute>
        } />
        
        {/* ================================= */}
        {/* === ROUTES SECRÉTAIRE PRINCIPALE === */}
        {/* ================================= */}
        <Route path="/secretary_primary/dashboard" element={
          <ProtectedRoute allowedRoles={['secretary_primary']}>
            <EaglePrincipalDashboard />
          </ProtectedRoute>
        } />
        <Route path="/secretary_primary/virtual-rooms" element={
          <ProtectedRoute allowedRoles={['secretary_primary']}>
            <EagleSallesAttente />
          </ProtectedRoute>
        } />
        <Route path="/secretary_primary/urgency-validation" element={
          <ProtectedRoute allowedRoles={['secretary_primary']}>
            <EagleUrgencyValidation />
          </ProtectedRoute>
        } />
        <Route path="/secretary_primary/consultants" element={
          <ProtectedRoute allowedRoles={['secretary_primary']}>
            <EagleConsultantManagement />
          </ProtectedRoute>
        } />
        <Route path="/secretary_primary/supervision" element={
          <ProtectedRoute allowedRoles={['secretary_primary']}>
            <SupervisionDashboard />
          </ProtectedRoute>
        } />
        <Route path="/secretary_primary/communication" element={
          <ProtectedRoute allowedRoles={['secretary_primary']}>
            <EagleCommunication />
          </ProtectedRoute>
        } />
        <Route path="/secretary_primary/performance" element={
          <ProtectedRoute allowedRoles={['secretary_primary']}>
            <PerformanceTableau />
          </ProtectedRoute>
        } />
        
        {/* ======================= */}
        {/* === ROUTES MÉDECIN === */}
        {/* ======================= */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <TableauBordMedecin />
          </ProtectedRoute>
        } />
        <Route path="/doctor/waiting-room" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <SalleAttenteVirtuelle />
          </ProtectedRoute>
        } />
        <Route path="/doctor/urgencies" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <GestionUrgences />
          </ProtectedRoute>
        } />
        <Route path="/doctor/communication" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorCommunicationCenter />
          </ProtectedRoute>
        } />
        <Route path="/doctor/teleconsultation" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <TeleconsultationInterface />
          </ProtectedRoute>
        } />
        
        {/* ======================== */}
        {/* === ROUTES INFIRMIER === */}
        {/* ======================== */}
        <Route path="/nurse/dashboard" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <EagleDashboard />
          </ProtectedRoute>
        } />
        <Route path="/nurse/urgencies" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <GestionUrgencesSecretaire />
          </ProtectedRoute>
        } />
        <Route path="/nurse/pre-consultation" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <SallePreconsultation />
          </ProtectedRoute>
        } />
        <Route path="/nurse/post-consultation" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <PostConsultationInterface />
          </ProtectedRoute>
        } />
        <Route path="/nurse/offline" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <OfflineManagementInterface />
          </ProtectedRoute>
        } />
        <Route path="/nurse/technical-monitoring" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <TechnicalMonitoringInterface />
          </ProtectedRoute>
        } />
        <Route path="/nurse/communication" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <InfirmierMessagingApp />
          </ProtectedRoute>
        } />
        <Route path="/nurse/appointment-form" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <FormulairePriseRDV />
          </ProtectedRoute>
        } />
        <Route path="/nurse/urgency-submission" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <SoumissionUrgence />
          </ProtectedRoute>
        } />
        
        {/* ======================================= */}
        {/* === ROUTES SECRÉTAIRE SECONDAIRE === */}
        {/* ======================================= */}
        <Route path="/secretary_secondary/dashboard" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <EagleDashboard />
          </ProtectedRoute>
        } />
        <Route path="/secretary_secondary/urgencies" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <GestionUrgencesSecretaire />
          </ProtectedRoute>
        } />
        <Route path="/secretary_secondary/post-consultation" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <PostConsultationInterface />
          </ProtectedRoute>
        } />
        <Route path="/secretary_secondary/offline" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <OfflineManagementInterface />
          </ProtectedRoute>
        } />
        <Route path="/secretary_secondary/technical-monitoring" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <TechnicalMonitoringInterface />
          </ProtectedRoute>
        } />
        <Route path="/secretary_secondary/communication" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <SecretaireSMessagingApp />
          </ProtectedRoute>
        } />
        <Route path="/secretary_secondary/appointment-form" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <FormulairePriseRDV />
          </ProtectedRoute>
        } />
        <Route path="/secretary_secondary/urgency-submission" element={
          <ProtectedRoute allowedRoles={['secretary_secondary']}>
            <SoumissionUrgence />
          </ProtectedRoute>
        } />
        
        {/* ======================== */}
        {/* === REDIRECTIONS === */}
        {/* ======================== */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/secretary_primary" element={<Navigate to="/secretary-primary/dashboard" replace />} />
        <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="/nurse" element={<Navigate to="/nurse/dashboard" replace />} />
        <Route path="/secretary_secondary" element={<Navigate to="/secretary-secondary/dashboard" replace />} />
        
        {/* === ROUTE 404 === */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;