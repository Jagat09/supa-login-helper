
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    const { email } = values;
    const { error, success } = await resetPassword(email);
    
    setIsLoading(false);
    
    if (success) {
      setSuccess(true);
    } else {
      setError(error?.message || 'Failed to send reset link. Please try again.');
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="text-gray-600">
              We've sent a password reset link to your email address.
              Please check your inbox and follow the instructions.
            </p>
            <div className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSuccess(false)}
                className="mt-4"
              >
                Try another email
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-auth-600 hover:text-auth-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        className="pl-10" 
                        placeholder="you@example.com" 
                        type="email" 
                        disabled={isLoading}
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-auth-600 hover:bg-auth-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>

            <div className="text-center mt-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-auth-600 hover:text-auth-500"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
