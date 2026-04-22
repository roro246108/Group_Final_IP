import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import EditProfileForm from "../Components/EditProfileForm";
import UpcomingStays from "../Components/UpcomingStays";
import BookingHistory from "../Components/BookingHistory";
import {
  CalendarDays, History, Award, Edit3, Shield, X, 
  LogOut, Loader2, AlertCircle 
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Edit Profile', icon: Edit3 },
  { id: 'upcoming', label: 'Upcoming Stays', icon: CalendarDays },
  { id: 'history', label: 'Booking History', icon: History },
];

// --- Profile Page Component ---
export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // States for Live Data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [activeTab, setActiveTab] = useState('profile');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastChangedText, setLastChangedText] = useState("3 months ago");

  // Fetch Profile from MongoDB Atlas
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5050/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError("Session expired. Please login again.");
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, [navigate]);

  const handlePasswordUpdate = () => {
    setShowSuccessToast(true);
    const now = new Date();
    setLastChangedText(`today, ${now.toLocaleDateString()}`);
  };

  const handleLogOutConfirm = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/'); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Fetching your profile...</p>
      </div>
    );
  }

  if (error) return <div className="p-20 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 relative font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Pass the real database profile to the Hero */}
        <ProfileHero user={profile} />

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl mb-10 border border-slate-200/60 shadow-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button 
              key={id} 
              onClick={() => setActiveTab(id)} 
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
                {/* Pass profile data to the form for editing */}
                <EditProfileForm initialData={profile} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-blue-900 tracking-tight">Account Security</h3>
                    <p className="text-[11px] text-slate-500 font-medium tracking-tight">Manage your credentials</p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200/50">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Password</p>
                      <p className="text-xs text-slate-500">Last updated {lastChangedText}</p>
                    </div>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-blue-600 font-bold text-xs rounded-lg shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-95">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-10 mt-10 border-t border-slate-200 flex justify-center">
                <button 
                  onClick={() => setIsLogOutModalOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95 group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Log Out
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'upcoming' && <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm"><UpcomingStays /></div>}
          {activeTab === 'history' && <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm"><BookingHistory /></div>}
        </div>
      </div>

      <LogOutModal 
        isOpen={isLogOutModalOpen} 
        isLoggingOut={isLoggingOut}
        onClose={() => setIsLogOutModalOpen(false)} 
        onConfirm={handleLogOutConfirm} 
      />
    </div>
  );
}

// --- ProfileHero helper ---
function ProfileHero({ user }) {
  // Helper to get initials from the MongoDB firstName and lastName
  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || "??";

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl border border-blue-900 bg-blue-900">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
      <div className="relative z-10 p-10 flex flex-col sm:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center text-blue-900 text-4xl font-black shadow-2xl border-4 border-blue-700">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-blue-400 w-6 h-6 rounded-full border-4 border-blue-900 shadow-lg"></div>
        </div>
        <div className="text-center sm:text-left flex-1 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <div className="bg-blue-600/40 border border-blue-400/40 px-3 py-1 rounded-lg flex items-center gap-1.5 self-center sm:self-auto">
              <Award className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {user.role === 'admin' ? "Admin Account" : "Member"}
              </span>
            </div>
          </div>
          <p className="text-blue-200 text-lg mt-1 font-medium opacity-90">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

// --- LogOutModal ---
function LogOutModal({ isOpen, onClose, onConfirm, isLoggingOut }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
            <LogOut className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Log Out?</h3>
          <p className="text-slate-500 text-sm mb-8">Are you sure you want to log out?</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-slate-600 font-bold rounded-xl border border-slate-200">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
