
import React from 'react';
import { 
  ClipboardList, 
  Users, 
  BarChart, 
  Settings, 
  Home, 
  LogOut 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive 
}) => (
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
  </Link>
);

interface SidebarProps {
  userRole: string | null;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const adminNavItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/dashboard' 
    },
    { 
      icon: ClipboardList, 
      label: 'Tasks', 
      href: '/tasks' 
    },
    { 
      icon: Users, 
      label: 'Team', 
      href: '/team' 
    },
    { 
      icon: BarChart, 
      label: 'Analytics', 
      href: '/analytics' 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      href: '/settings' 
    }
  ];

  const userNavItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/dashboard' 
    },
    { 
      icon: ClipboardList, 
      label: 'My Tasks', 
      href: '/tasks' 
    },
    { 
      icon: Settings, 
      label: 'Profile', 
      href: '/profile' 
    }
  ];

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="
      fixed left-0 top-0 h-full w-64 
      bg-white border-r 
      shadow-sm py-8 px-4 
      flex flex-col
    ">
      <div className="mb-10 pl-4">
        <h2 className="text-2xl font-bold text-auth-600">
          Task Manager
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={isActive(item.href)}
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
