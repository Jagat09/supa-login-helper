import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Loader2, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/layout/Sidebar';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.rpc('get_user_role');
        
        if (error) {
          console.error('Error fetching user role:', error);
          toast({
            title: "Error",
            description: "Could not fetch user role. Please try again later.",
            variant: "destructive",
          });
        } else {
          setUserRole(data);
          console.log("User role fetched successfully:", data);
        }
      } catch (err) {
        console.error('Exception when fetching user role:', err);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, toast]);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/login');
    setIsLoading(false);
  };

  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-auth-600 mb-2" />
        <span className="text-lg text-gray-700">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <DashboardHeader 
          userRole={userRole} 
          onSignOut={handleSignOut} 
          isLoading={isLoading} 
        />

        <div className="container mx-auto py-8 px-4">
          {userRole === 'admin' ? (
            <AdminDashboard userId={user?.id} />
          ) : (
            <UserDashboard userId={user?.id} userRole={userRole} />
          )}
        </div>
      </main>
    </div>
  );
}
