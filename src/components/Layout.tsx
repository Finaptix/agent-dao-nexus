
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Network,
  History, 
  Settings 
} from 'lucide-react';
import WalletConnect from './WalletConnect';
import { useAppContext } from '@/contexts/AppContext';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
      active 
        ? "bg-inject-blue text-white" 
        : "text-muted-foreground hover:bg-muted hover:text-white"
    )}
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r bg-sidebar border-sidebar-border">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="animate-pulse text-2xl">🧠</span>
            <span className="text-xl font-bold text-inject-cyan">Inject AI</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={currentPath === '/'} 
          />
          <NavItem 
            to="/agents" 
            icon={<Users size={18} />} 
            label="Agents" 
            active={currentPath === '/agents'} 
          />
          <NavItem 
            to="/proposals" 
            icon={<FileText size={18} />} 
            label="Proposals" 
            active={currentPath === '/proposals'} 
          />
          <NavItem 
            to="/network" 
            icon={<Network size={18} />} 
            label="Network" 
            active={currentPath === '/network'} 
          />
          <NavItem 
            to="/transactions" 
            icon={<History size={18} />} 
            label="Transactions" 
            active={currentPath === '/transactions'} 
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
          />
          <div className="mt-4 rounded-md bg-sidebar-accent p-3 text-xs">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="flex items-center text-inject-green">
                <span className="mr-1 h-2 w-2 rounded-full bg-inject-green"></span>
                Minato
              </span>
            </div>
            <div className="truncate font-mono text-xs text-muted-foreground">
              Chain ID: 1946
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 bg-background">
        {children}
      </main>
    </div>
  );
};

export default Layout;
