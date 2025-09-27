import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const createOrUpdateUser = async (email, password, role, additionalData) => {
  try {
    let user;
    
    // Try to create new user
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
      console.log(`Created new ${role} user:`, email);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // User exists, sign in to get the user object
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        console.log(`${role} user already exists:`, email);
      } else {
        throw error;
      }
    }

    // Always update/create the user document with correct role
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create role-specific document
    const collectionName = role === 'vendor' ? 'vendors' : 'customers';
    await setDoc(doc(db, collectionName, user.uid), {
      email: email,
      ...additionalData,
      createdAt: new Date()
    });

    console.log(`${role} documents updated successfully`);
    return { success: true, user };
  } catch (error) {
    console.error(`Error setting up ${role}:`, error);
    return { success: false, error: error.message };
  }
};

export const setupDemoUsers = async () => {
  try {
    console.log('Setting up demo users...');

    // Setup customer
    const customerResult = await createOrUpdateUser(
      'customer@demo.com',
      'demo123',
      'customer',
      {
        name: 'Demo Customer',
        phone: '+91 9876543210',
        address: '123 Demo Street, Mumbai, Maharashtra',
        preferences: {
          dietary: 'vegetarian',
          spiceLevel: 'medium'
        }
      }
    );

    // Setup vendor
    const vendorResult = await createOrUpdateUser(
      'vendor@demo.com',
      'vendor456',
      'vendor',
      {
        businessName: 'Demo Tiffin Service',
        phone: '+91 9876543211',
        address: '456 Business Street, Mumbai, Maharashtra',
        serviceAreas: ['Bandra', 'Andheri', 'Juhu']
      }
    );

    if (customerResult.success && vendorResult.success) {
      return { success: true, message: 'Demo users setup completed successfully!' };
    } else {
      const errors = [];
      if (!customerResult.success) errors.push(`Customer: ${customerResult.error}`);
      if (!vendorResult.success) errors.push(`Vendor: ${vendorResult.error}`);
      return { success: false, error: errors.join(', ') };
    }
  } catch (error) {
    console.error('Error setting up demo users:', error);
    return { success: false, error: error.message };
  }
};
