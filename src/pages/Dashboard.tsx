
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Loader2, LogOut, Plus, CheckSquare, Clock, User } from 'lucide-react';
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
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager Dashboard</h1>
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
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-emerald-500" />
                My Tasks
              </CardTitle>
              <CardDescription>Manage your personal tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You have 0 tasks assigned to you.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create New Task
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Tasks due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No upcoming deadlines.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">View All Deadlines</Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Account
              </CardTitle>
              <CardDescription>User: {user?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage your profile and settings
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">Profile Settings</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
