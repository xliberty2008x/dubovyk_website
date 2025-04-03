"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { type EmailOtpType } from '@supabase/supabase-js'; // Import the type
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// Link component is used below, ensure it's imported if needed elsewhere or remove if not
import Link from 'next/link';


const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Show form only after client-side verification
  const [isVerifying, setIsVerifying] = useState(true); // Track verification state
  const router = useRouter();

  // Client-side OTP Verification Flow
  useEffect(() => {
    console.log('[Update Page] Mounted. Checking URL query params for token_hash and type.');
    setIsVerifying(true);
    setError(null); // Clear previous errors

    const searchParams = new URLSearchParams(window.location.search);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null; // Cast type appropriately

    if (token_hash && type) {
      console.log(`[Update Page] Found token_hash and type. Attempting client-side verifyOtp...`);

      const verifyToken = async () => {
        // Use the normal client-side supabase instance
        const { error: verifyError, data } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        setIsVerifying(false); // Verification attempt finished

        if (!verifyError && data) {
           // This automatically signs the user in on the client side
          console.log(`[Update Page] Client-side verifyOtp successful. User session established. Showing form.`);
          setShowForm(true);
          setMessage('Please enter and confirm your new password.');
        } else {
          console.error('[Update Page] Client-side verifyOtp failed:', verifyError?.message || 'Unknown error');
          setError(`Password reset link is invalid or has expired. Error: ${verifyError?.message || 'Unknown'}`);
          setShowForm(false); // Do not show form if verification fails
        }
      };

      verifyToken();

    } else {
      console.warn('[Update Page] Missing token_hash or type in query parameters.');
      setError('Invalid password reset link (missing parameters).');
      setIsVerifying(false);
      setShowForm(false);
    }

    // Listen for auth changes (e.g., SIGNED_OUT)
     const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        console.log('[Update Page] User signed out, redirecting.');
        router.push('/login');
      }
    });

     return () => {
      subscription.unsubscribe();
    };

  }, [router]); // Depend on router

  const handlePasswordUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
    }

    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // User should be authenticated at this point due to client-side verifyOtp
      console.log('[Update Page] Attempting password update for client-side authenticated user...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         // This shouldn't happen if verifyOtp worked, but check just in case
         throw new Error("User session not found after verification. Please try the link again.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error('[Update Page] Error updating password:', updateError);
        throw updateError;
      }

      console.log('[Update Page] Password update successful.');
      setMessage("Password updated successfully! You can now log in with your new password.");
      
      // Optionally redirect after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      console.error("Password update error:", err);
      if (err.message?.includes("session")) {
        setError("You need to use a valid password reset link. Please check your email for a reset link or request a new one from the login page.");
      } else {
        setError(err.message || "Failed to update password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Update Password
          </h2>

          {showForm ? ( // Show form only if client-side verification succeeded
            <>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
              </form>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Note: To reset your password, you should:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Go to the <a href="/login" className="text-blue-600 hover:underline">login page</a></li>
                  <li>Click on "Forgot password?"</li>
                  <li>Enter your email and request a reset link</li>
                  <li>Check your email and click the reset link</li>
                </ol>
              </div>
            </>
          ) : ( // Show verifying/error message
            <div className="text-center text-gray-600 dark:text-gray-400">
              {isVerifying ? (
                <p>Verifying password reset link...</p>
              ) : (
                <p className="text-red-500">{error || 'Failed to verify password reset link.'}</p>
              )}
              <p className="text-sm mt-2">If the problem persists, please request a new link.</p>
              <Link href="/login" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                 Go to Login
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UpdatePasswordPage;
