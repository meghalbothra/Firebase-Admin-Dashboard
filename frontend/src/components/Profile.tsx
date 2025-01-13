import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import { 
  User, LogOut, Mail, Calendar, Activity,
  Clock, Settings, Bell, ChevronLeft
} from "lucide-react";

const ActivityCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(auth);
    } catch (err) {
      setError("An error occurred while logging out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)} // Navigate back to the previous page
                className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700 relative">
                <div className="absolute top-4 right-4 flex space-x-2">
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <div className="-mt-16 mb-6 flex justify-center">
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center border-4 border-white shadow-lg">
                        <User size={48} className="text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.displayName || 'User Profile'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Admin</p>
                </div>

                <div className="space-y-3">
                  <div className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 mt-6 bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActivityCard 
                icon={Activity} 
                title="Account Status" 
                value="Active" 
              />
              <ActivityCard 
                icon={Clock} 
                title="Role" 
                value="Admin" 
              />
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Account ID</label>
                      <p className="mt-1 text-sm font-mono text-gray-900">{user.uid}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Member Since</label>
                      <p className="mt-1 text-sm text-gray-900">January 2024</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email Status</label>
                      <p className="mt-1 text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-white border border-red-100 text-red-600 px-4 py-3 rounded-lg shadow-lg animate-[slideIn_0.5s_ease-out] flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-600"></div>
          <p>{error}</p>
        </div>
      )}

      <style tsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
