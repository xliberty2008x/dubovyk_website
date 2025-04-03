"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client
import Navbar from '@/components/layout/Navbar'; // Assuming Navbar is desired on login page
import Footer from '@/components/layout/Footer';   // Assuming Footer is desired

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      // Login successful, redirect to homepage or an admin dashboard (e.g., /admin)
      router.push('/');
      router.refresh(); // Refresh to ensure layout potentially updates based on auth state

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset request
  const handlePasswordResetRequest = async (event: FormEvent) => {
    event.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    setError(null);
    setMessage(null);
    setLoading(true);
    const redirectUrl = `${window.location.origin}/update-password`;
    console.log(`[Reset Request] Attempting to send reset email to: ${email} with redirect to: ${redirectUrl}`);

    try {
      // Request password reset email from Supabase
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        console.error(`[Reset Request] Supabase error:`, resetError);
        throw resetError;
      }

      console.log('[Reset Request] Supabase call successful (email sending initiated). Data:', data);
      setMessage(`Password reset link sent to ${email}. Please check your email (it might take a moment).`);
    } catch (err: any) {
      console.error("[Reset Request] Caught error:", err);
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle between login and password reset forms
  const toggleResetPassword = () => {
    setIsResettingPassword(!isResettingPassword);
    setError(null);
    setMessage(null);
  };
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">

            {isResettingPassword ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                  Reset Password
                </h2>
                <form onSubmit={handlePasswordResetRequest} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email-reset"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email-reset"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm">
                      Error: {error}
                    </div>
                  )}
                  {message && (
                    <div className="text-green-600 dark:text-green-400 text-sm">
                      {message}
                    </div>
                  )}
                  
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={toggleResetPassword}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                  Admin Login
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="email-login" // Unique ID for login email
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email-login"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                 {/* Display Login Error and Success Message */}
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    Error: {error}
                  </div>
                )}
                {message && (
                  <div className="text-green-600 dark:text-green-400 text-sm">
                    {message}
                  </div>
                )}
                
                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={toggleResetPassword}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
                </form>
              </>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
