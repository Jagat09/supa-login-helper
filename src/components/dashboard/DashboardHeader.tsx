
import { Button } from '@/components/ui/button';
import { LogOut, ClipboardList, UserCircle, ShieldCheck } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface DashboardHeaderProps {
  heading?: string;
  text?: string;
  userRole?: string | null;
  onSignOut?: () => void;
  isLoading?: boolean;
}

export default function DashboardHeader({ 
  heading, 
  text, 
  userRole, 
  onSignOut, 
  isLoading 
}: DashboardHeaderProps) {
  const isAdmin = userRole === 'admin';
  
  return (
    <header className="flex flex-col space-y-2 mb-8">
      {heading && <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>}
      {text && <p className="text-muted-foreground">{text}</p>}
      
      {onSignOut && (
        <div className="flex items-center gap-4 mt-2">
          <div className={`flex items-center gap-2 text-sm ${isAdmin ? 'text-auth-600' : 'text-gray-600'} rounded-full px-3 py-1 ${isAdmin ? 'bg-auth-50' : ''}`}>
            {isAdmin ? (
              <>
                <ShieldCheck className="h-5 w-5 text-auth-600" />
                <span className="font-medium">Admin</span>
              </>
            ) : (
              <>
                <UserCircle className="h-5 w-5" />
                <span>{userRole || 'User'}</span>
              </>
            )}
          </div>
          
          <Button 
            variant={isAdmin ? "default" : "outline"}
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
      )}
    </header>
  );
}
