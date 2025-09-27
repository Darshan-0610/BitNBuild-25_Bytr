import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import toast from 'react-hot-toast';
import { Building2, Lock, Mail, Settings, UserPlus } from 'lucide-react';
import { setupDemoUsers } from '../utils/setupDemoUsers';

const VendorLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  const handleSetupDemoUsers = async () => {
    setSetupLoading(true);
    try {
      const result = await setupDemoUsers();
      if (result.success) {
        toast.success('Demo users created successfully!');
      } else {
        toast.error(result.error || 'Failed to create demo users');
      }
    } catch (error) {
      toast.error('Error setting up demo users: ' + error.message);
    } finally {
      setSetupLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login existing vendor
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back to your dashboard!');
      } else {
        // Register new vendor
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore with vendor role
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'vendor',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Create vendor-specific document
        await setDoc(doc(db, 'vendors', user.uid), {
          email: user.email,
          businessName: businessName || 'My Tiffin Business',
          phone: '',
          address: '',
          serviceAreas: [],
          createdAt: new Date()
        });

        toast.success('Vendor account created successfully!');
      }
    } catch (error) {
      console.error('Vendor authentication error:', error);
      let errorMessage = 'Authentication failed';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No vendor account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already registered';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiffin-50 to-tiffin-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-tiffin-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Vendor Sign In' : 'Create Vendor Account'}
          </h2>
          <p className="mt-2 text-gray-600">
            Tiffin Logistics - Vendor Dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your vendor email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Your tiffin business name"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In to Dashboard' : 'Create Vendor Account')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-tiffin-600 hover:text-tiffin-700 font-medium transition-colors"
            >
              {isLogin ? "Don't have a vendor account? Register here" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo credentials and setup */}
          <div className="bg-tiffin-50 p-4 rounded-lg text-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-tiffin-800">Demo Vendor Account:</p>
              <button
                type="button"
                onClick={handleSetupDemoUsers}
                disabled={setupLoading}
                className="flex items-center text-xs bg-tiffin-600 text-white px-2 py-1 rounded hover:bg-tiffin-700 disabled:opacity-50"
              >
                <Settings className="h-3 w-3 mr-1" />
                {setupLoading ? 'Setting up...' : 'Setup Demo Users'}
              </button>
            </div>
            <p className="text-tiffin-700">
              <strong>Email:</strong> vendor@demo.com<br />
              <strong>Password:</strong> vendor456
            </p>
            <p className="text-xs mt-2 text-tiffin-600">
              Click "Setup Demo Users" if login fails or demo account doesn't exist
            </p>
          </div>

          {/* Navigation to customer login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Are you a customer?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="text-tiffin-600 hover:text-tiffin-700 font-medium"
              >
                Customer Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorLogin;