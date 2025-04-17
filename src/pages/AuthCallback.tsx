
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract the hash from the URL
        const hash = window.location.hash;

        if (hash) {
          // Handle the OAuth callback
          const { error } = await supabase.auth.getUser();
          if (error) throw error;
        }

        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // Redirect based on auth state
        if (session) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error during auth callback:', err);
        setError((err as Error).message);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-red-200 max-w-md w-full">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-auth-600 hover:bg-auth-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auth-500"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <Loader2 className="h-12 w-12 animate-spin text-auth-600 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900">Completing authentication...</h2>
      <p className="text-gray-500 mt-2">You will be redirected automatically.</p>
    </div>
  );
}
