
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Network,
  History, 
  Settings,
  ChevronLeft,
  MenuIcon
} from 'lucide-react';
import WalletConnect from './WalletConnect';
import { useAppContext } from '@/contexts/AppContext';
import { useMediaQuery } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, onClick }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-muted hover:text-white",
      active 
        ? "bg-inject-blue text-white" 
        : "text-muted-foreground"
    )}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { 
    walletConnected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet 
  } = useAppContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  // Sidebar content component to avoid duplication
  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/72e54d8e-598d-49c3-a8da-c1e64e0eb8f9.png" 
            alt="Inject AI" 
            className="h-8 w-8"
          />
          {!sidebarCollapsed && <span className="text-xl font-bold text-inject-cyan">Inject AI</span>}
        </Link>
        {!isMobile && (
          <button 
            onClick={toggleSidebar} 
            className="ml-auto text-muted-foreground hover:text-white"
          >
            <ChevronLeft 
              size={20} 
              className={cn("transition-transform", sidebarCollapsed && "rotate-180")} 
            />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <NavItem 
          to="/" 
          icon={<LayoutDashboard size={18} />} 
          label="Dashboard" 
          active={currentPath === '/'} 
          onClick={closeMobileSidebar}
        />
        <NavItem 
          to="/agents" 
          icon={<Users size={18} />} 
          label="Agents" 
          active={currentPath === '/agents'} 
          onClick={closeMobileSidebar}
        />
        <NavItem 
          to="/proposals" 
          icon={<FileText size={18} />} 
          label="Proposals" 
          active={currentPath === '/proposals'} 
          onClick={closeMobileSidebar}
        />
        <NavItem 
          to="/network" 
          icon={<Network size={18} />} 
          label="Network" 
          active={currentPath === '/network'} 
          onClick={closeMobileSidebar}
        />
        <NavItem 
          to="/transactions" 
          icon={<History size={18} />} 
          label="Transactions" 
          active={currentPath === '/transactions'} 
          onClick={closeMobileSidebar}
        />
      </nav>
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="mb-4">
          <WalletConnect 
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            connected={walletConnected}
            address={walletAddress}
          />
        </div>
        <NavItem 
          to="/settings" 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={currentPath === '/settings'} 
          onClick={closeMobileSidebar}
        />
        <div className="mt-4 rounded-md bg-sidebar-accent p-3 text-xs">
          {!sidebarCollapsed && (
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="flex items-center text-inject-green">
                <span className="mr-1 h-2 w-2 rounded-full bg-inject-green"></span>
                Minato
              </span>
            </div>
          )}
          <div className={cn(
            "font-mono text-xs text-muted-foreground",
            sidebarCollapsed ? "text-center" : "truncate"
          )}>
            {sidebarCollapsed ? (
              <span className="flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-inject-green"></span>
              </span>
            ) : (
              "Chain ID: 1946"
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed left-4 top-4 z-30 rounded-md bg-sidebar p-2 text-white shadow-md"
        >
          <MenuIcon size={24} />
        </button>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-20 transform transition-transform duration-300 ease-in-out",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileSidebar}
          ></div>
          <aside className="absolute left-0 top-0 h-full w-64 overflow-y-auto border-r bg-sidebar border-sidebar-border">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside 
          className={cn(
            "fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-sidebar border-sidebar-border transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent />
        </aside>
      )}

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          isMobile ? "ml-0" : (sidebarCollapsed ? "ml-16" : "ml-64")
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
