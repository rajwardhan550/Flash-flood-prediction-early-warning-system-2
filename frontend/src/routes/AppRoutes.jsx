import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import AuthorityLayout from '../components/layout/AuthorityLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home from '../pages/public/Home';
import LiveMap from '../pages/public/LiveMap';
import Weather from '../pages/public/Weather';
import Safety from '../pages/public/Safety';
import About from '../pages/public/About';
import Login from '../pages/public/Login';

// Admin Pages
import AdminOverview from '../pages/admin/AdminOverview';
import AdminSystemHealth from '../pages/admin/AdminSystemHealth';
import SensorsManagement from '../pages/admin/SensorsManagement';
import UsersManagement from '../pages/admin/UsersManagement';
import ZonesManagement from '../pages/admin/ZonesManagement';
import MLModelsManagement from '../pages/admin/MLModelsManagement';
import DataSourcesManagement from '../pages/admin/DataSourcesManagement';
import AdminAlerts from '../pages/admin/AdminAlerts';
import AdminReports from '../pages/admin/AdminReports';
import AuthoritiesManagement from '../pages/admin/AuthoritiesManagement';
import CitizensManagement from '../pages/admin/CitizensManagement';
import LogsViewer from '../pages/admin/LogsViewer';
import Settings from '../pages/admin/Settings';

// Authority Pages
import AuthorityOverview from '../pages/authority/AuthorityOverview';
import AuthorityAlerts from '../pages/authority/AuthorityAlerts';
import EmergencyBroadcast from '../pages/authority/EmergencyBroadcast';
import AuthorityReports from '../pages/authority/AuthorityReports';
import AuthoritySystemHealth from '../pages/authority/AuthoritySystemHealth';
import Hydrographs from '../pages/authority/Hydrographs';
import LiveRiskMapAuthority from '../pages/authority/LiveRiskMap';
import Precipitation from '../pages/authority/Precipitation';
import Predictions from '../pages/authority/Predictions';
import PriorityZones from '../pages/authority/PriorityZones';
import SensorNetwork from '../pages/authority/SensorNetwork';
import SoilMoisture from '../pages/authority/SoilMoisture';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
          <Route path="/admin/overview" element={<AdminOverview />} />
          <Route path="/admin/system-health" element={<AdminSystemHealth />} />
          <Route path="/admin/sensors" element={<SensorsManagement />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/zones" element={<ZonesManagement />} />
          <Route path="/admin/ml-models" element={<MLModelsManagement />} />
          <Route path="/admin/data-sources" element={<DataSourcesManagement />} />
          <Route path="/admin/alerts" element={<AdminAlerts />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/authorities" element={<AuthoritiesManagement />} />
          <Route path="/admin/citizens" element={<CitizensManagement />} />
          <Route path="/admin/logs" element={<LogsViewer />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Authority Routes */}
      <Route element={<ProtectedRoute allowedRoles={['authority', 'admin']} />}>
        <Route element={<AuthorityLayout />}>
          <Route path="/authority" element={<Navigate to="/authority/overview" replace />} />
          <Route path="/authority/overview" element={<AuthorityOverview />} />
          <Route path="/authority/alerts" element={<AuthorityAlerts />} />
          <Route path="/authority/broadcast" element={<EmergencyBroadcast />} />
          <Route path="/authority/reports" element={<AuthorityReports />} />
          <Route path="/authority/system-health" element={<AuthoritySystemHealth />} />
          <Route path="/authority/hydrographs" element={<Hydrographs />} />
          <Route path="/authority/map" element={<LiveRiskMapAuthority />} />
          <Route path="/authority/precipitation" element={<Precipitation />} />
          <Route path="/authority/predictions" element={<Predictions />} />
          <Route path="/authority/priority-zones" element={<PriorityZones />} />
          <Route path="/authority/sensor-network" element={<SensorNetwork />} />
          <Route path="/authority/soil-moisture" element={<SoilMoisture />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;