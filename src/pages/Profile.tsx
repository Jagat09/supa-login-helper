
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/layout/Sidebar';

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Use the security definer function we created in the SQL migration
      const { data, error } = await supabase.rpc('get_current_user_role');
      
      if (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Could not fetch user data. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username, email, role')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user profile:', userError);
      } else if (userData) {
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setUserRole(userData.role || data);
      }
    } catch (err) {
      console.error('Exception when fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('users')
        .update({
          username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Could not update profile. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      }
    } catch (err) {
      console.error('Exception when updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Sidebar userRole={userRole} />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your account settings
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-auth-600" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={userRole || 'user'}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your password to keep your account secure
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
