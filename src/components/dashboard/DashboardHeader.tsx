
import { Button } from '@/components/ui/button';
import { LogOut, ClipboardList, UserCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface DashboardHeaderProps {
  userRole: string | null;
  onSignOut: () => void;
  isLoading: boolean;
}

export default function DashboardHeader({ userRole, onSignOut, isLoading }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center">
          <ClipboardList className="h-6 w-6 text-auth-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Task Manager
            {userRole === 'admin' && (
              <span className="ml-2 text-xs uppercase bg-auth-600 text-white px-2 py-1 rounded">
                Admin
              </span>
            )}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserCircle className="h-5 w-5" />
            <span>{userRole || 'User'}</span>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onSignOut}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
