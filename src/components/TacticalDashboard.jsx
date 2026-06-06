import { useState, useEffect } from 'react';
import { Home, MapPin, Database, UserCheck, ShieldAlert } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import HomeModule from './HomeModule.jsx';
import MapView from './MapView.jsx';
import ContentManagement from './ContentManagement.jsx';
import AccessLog from './AccessLog.jsx';
import SystemAudit from './SystemAudit.jsx';
import AdminCredentials from './AdminCredentials.jsx';
import UserCreation from './UserCreation.jsx';

function TacticalDashboard({ currentUser, onLogout }) {
  const [timeString, setTimeString] = useState('00:00:00');
  const [activeModule, setActiveModule] = useState('INICIO');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const modules = [
    { id: 'INICIO', label: 'Inicio', Icon: Home },
    { id: 'MAPA', label: 'Mapa', Icon: MapPin },
    { id: 'GESTION', label: 'Gestión de Contenido', Icon: Database },
    { id: 'BITACORA', label: 'Bitácora de Acceso', Icon: UserCheck },
    { id: 'AUDITORIA', label: 'Auditoría de Sistema', Icon: ShieldAlert }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('es-VE', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case 'INICIO':
        return <HomeModule />;
      case 'MAPA':
        return <MapView />;
      case 'GESTION':
        return <ContentManagement />;
      case 'BITACORA':
        return <AccessLog />;
      case 'AUDITORIA':
        return <SystemAudit />;
      // Las opciones de admin/creación se manejan vía backend.
      case 'ADMIN_CRED':
        return <AdminCredentials />;
      case 'USER_CREATE':
        return <UserCreation />;

      default:
        return <HomeModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen grid-cols-[auto_1fr] gap-6 p-5 lg:p-8">
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        />

        <main className="space-y-6">
          <Header
            currentUser={currentUser}
            currentTime={timeString}
            onSelectProfileAction={setActiveModule}
            onLogout={onLogout}
          />

          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default TacticalDashboard;
