import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const apiBase = import.meta.env.VITE_BASE_URL;

interface AuthContextType {
 role: 'OMC_ADMIN' | 'STATION_MANAGER' | 'PUMP_ATTENDANT' | null;
  setRole: (role: 'OMC_ADMIN' | 'STATION_MANAGER' | 'PUMP_ATTENDANT' | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
   logout: () => {},
  isLoading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'OMC_ADMIN' | 'STATION_MANAGER' | 'PUMP_ATTENDANT' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Decode JWT to get user data
        const decoded: any = jwtDecode(token);
        
        // Set data from JWT token
        setRole(decoded.role);

        // Validate token with backend
        const validateResponse = await fetch(`${apiBase}/auth/validate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const validateData = await validateResponse.json();

        if (!validateResponse.ok || !validateData.success) {
          throw new Error('Invalid token or user data');
        }

        // Fetch latest profile data
        const profileResponse = await fetch(`${apiBase}/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const profileData = await profileResponse.json();

        if (profileResponse.ok) {
          // Update with profile data if available
          setRole(profileData.role || decoded.role || null);
        } else {
          console.warn('Failed to fetch profile data:', profileData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('accessToken');
        setRole(null);
        toast.error('Session expired or invalid. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    try {
    await fetch(`${apiBase}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    localStorage.removeItem('accessToken');
    setRole(null);
    toast.success('Logged out successfully');
   window.location.href = '/login';
  } catch (error) {
    toast.error('Logout failed');
  }
};

  return (
    <AuthContext.Provider value={{ role, setRole, 
      logout, 
      isLoading 
  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);