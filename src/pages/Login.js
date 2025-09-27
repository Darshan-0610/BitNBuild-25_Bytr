import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import toast from 'react-hot-toast';
import { User, Lock, Mail, UserPlus, Settings } from 'lucide-react';
import { setupDemoUsers } from '../utils/setupDemoUsers';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Role is always customer for this login page
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
        // Login existing user
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        // Register new user
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore with customer role
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Create customer document
        await setDoc(doc(db, 'customers', user.uid), {
          email: user.email,
          name: '',
          phone: '',
          address: '',
          createdAt: new Date()
        });

        toast.success('Account created successfully!');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tiffin-50 to-tiffin-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-tiffin-600 rounded-full flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Customer Sign In' : 'Create Customer Account'}
          </h2>
          <p className="mt-2 text-gray-600">
            Tiffin Logistics - Customer Portal
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
                  placeholder="Enter your email"
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

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-tiffin-600 hover:text-tiffin-700 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo credentials and setup */}
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Demo Customer Account:</p>
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
            <p><strong>Email:</strong> customer@demo.com</p>
            <p><strong>Password:</strong> demo123</p>
            <p className="text-xs mt-2 text-gray-500">Click "Setup Demo Users" if login fails</p>
          </div>

          {/* Navigation to vendor login */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Are you a vendor?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/vendor-login'}
                className="text-tiffin-600 hover:text-tiffin-700 font-medium"
              >
                Vendor Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;