import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Profile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      
      // Subscribe to user document
      const userRef = doc(db, 'users', currentUser.uid);
      unsubscribeUser = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const profile = data.profile || {};
            setFormData({
              name: profile.name || '',
              email: profile.email || '',
              phone: profile.phone || '',
              address: profile.address || '',
            });
            setLoading(false);
          } else {
            setLoading(false);
          }
        },
        (error) => {
          if (import.meta.env.DEV) {
            console.error('Error fetching profile:', error);
          }
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribe();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [navigate]);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Get current profile to preserve other fields (customerId, joinedAt, etc.)
      const userSnap = await getDoc(userRef);
      const currentData = userSnap.data();
      const currentProfile = currentData?.profile || {};
      
      // Update profile with form data while preserving existing fields
      await updateDoc(userRef, {
        profile: {
          ...currentProfile,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          // Email is preserved from currentProfile
        },
      });

      // Show success alert
      setShowSuccess(true);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      // Clear existing timeout
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
        successTimeoutRef.current = null;
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update profile. Please try again.';
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg flex items-center gap-3 shadow-md">
            <span className="text-xl">✅</span>
            <span className="font-semibold">Profile Updated Successfully</span>
          </div>
        )}

        {/* Settings Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-nmb-charcoal mb-8">Profile Settings</h1>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-nmb-charcoal mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-nmb-maroon" />
                  Full Name
                </div>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nmb-maroon/20 focus:border-nmb-maroon transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-nmb-charcoal mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-nmb-maroon" />
                  Email
                </div>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                placeholder="Email address"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-nmb-charcoal mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-nmb-maroon" />
                  Phone Number
                </div>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nmb-maroon/20 focus:border-nmb-maroon transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-nmb-charcoal mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-nmb-maroon" />
                  Address
                </div>
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nmb-maroon/20 focus:border-nmb-maroon transition-all resize-none"
                placeholder="Enter your address"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full h-12 bg-nmb-maroon hover:bg-[#6e0e00] text-white font-semibold rounded-lg shadow-medium hover:shadow-large transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

