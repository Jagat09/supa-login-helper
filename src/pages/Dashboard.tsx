
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Loader2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Welcome, {user?.email}</CardTitle>
              <CardDescription>Your account dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This is your protected dashboard page. Only authenticated users can access this area.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-gray-500">
                User ID: {user?.id.substring(0, 8)}...
              </p>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <p className="text-gray-600">Active</p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">Manage Account</Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Update your password, enable 2FA, and review your recent activities.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">Security Settings</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
