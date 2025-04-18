
import React from 'react';
import { 
  ClipboardList, 
  Users, 
  BarChart, 
  Settings, 
  Home, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isAdminOnly?: boolean;
  userRole?: string | null;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive,
  isAdminOnly,
  userRole 
}) => {
  const isAdmin = userRole === 'admin';
  
  // Don't render admin-only items for non-admin users
  if (isAdminOnly && !isAdmin) return null;
  
  return (
    <Link 
      to={href} 
      className={`
        flex items-center p-3 rounded-lg transition-colors duration-200 
        ${isActive 
          ? 'bg-auth-100 text-auth-600' 
          : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      <Icon className="mr-3 h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
      {isAdminOnly && <ShieldCheck className="ml-2 h-3 w-3 text-auth-600" />}
    </Link>
  );
};

interface SidebarProps {
  userRole: string | null;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const isAdmin = userRole === 'admin';

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/dashboard',
      isAdminOnly: false
    },
    { 
      icon: ClipboardList, 
      label: isAdmin ? 'All Tasks' : 'My Tasks', 
      href: '/tasks',
      isAdminOnly: false
    },
    { 
      icon: Users, 
      label: 'Team', 
      href: '/team',
      isAdminOnly: true
    },
    { 
      icon: BarChart, 
      label: 'Analytics', 
      href: '/analytics',
      isAdminOnly: true
    },
    { 
      icon: Settings, 
      label: isAdmin ? 'Settings' : 'Profile', 
      href: isAdmin ? '/settings' : '/profile',
      isAdminOnly: false
    }
  ];

  return (
    <div className="
      fixed left-0 top-0 h-full w-64 
      bg-white border-r 
      shadow-sm py-8 px-4 
      flex flex-col
    ">
      <div className="mb-10 pl-4 flex items-center">
        <h2 className="text-2xl font-bold text-auth-600">
          Task Manager
        </h2>
        {isAdmin && (
          <span className="ml-2 flex items-center text-xs bg-auth-600 text-white px-2 py-1 rounded">
            <ShieldCheck className="mr-1 h-3 w-3" />
            ADMIN
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={isActive(item.href)}
            userRole={userRole}
          />
        ))}
      </nav>

      <div className="mt-auto p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
