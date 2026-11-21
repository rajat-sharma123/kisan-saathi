import { useState, useEffect, createContext, useContext } from 'react';

const DEFAULT_DEMO_FARMER = {
  id: 'farmer_001',
  name: 'Ramesh Kumar Sharma',
  phone: '9876543210',
  email: 'ramesh.farmer@kisan.in',
  preferredLanguage: 'hi',
  state: 'Bihar',
  district: 'Bhagalpur',
  village: 'Kahalgaon',
  farmSize: '3.5', // in acres
  soilType: 'Alluvial Loam',
  primaryCrop: 'Rice (धान) & Wheat (गेहूं)',
  irrigationType: 'Borewell & Canal Canal Tubewell',
  isLoggedIn: true
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kisan_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_FARMER;
    } catch (e) {
      return DEFAULT_DEMO_FARMER;
    }
  });

  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('kisan_preferred_language');
    if (savedLang) return savedLang;
    return user?.preferredLanguage || 'hi';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('kisan_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kisan_auth_user');
    }
  }, [user]);

  const login = (credentials) => {
    const newUser = {
      ...DEFAULT_DEMO_FARMER,
      phone: credentials.phone || '9876543210',
      isLoggedIn: true
    };
    setUser(newUser);
    return newUser;
  };

  const register = (formData) => {
    const newUser = {
      id: `farmer_${Date.now()}`,
      name: formData.name || 'Pragatisheel Kisan',
      phone: formData.phone,
      email: formData.email || '',
      preferredLanguage: formData.preferredLanguage || 'hi',
      state: formData.state || 'Bihar',
      district: formData.district || 'Bhagalpur',
      village: formData.village || 'Gramin Kshetra',
      farmSize: formData.farmSize || '2.0',
      soilType: formData.soilType || 'Alluvial',
      primaryCrop: formData.primaryCrop || 'Wheat',
      irrigationType: formData.irrigationType || 'Tubewell',
      isLoggedIn: true
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  const changeLanguage = (langCode) => {
    localStorage.setItem('kisan_preferred_language', langCode);
    setLanguage(langCode);
    if (user) {
      setUser(prev => ({ ...prev, preferredLanguage: langCode }));
    }
  };

  const resetToDemoFarmer = () => {
    localStorage.setItem('kisan_preferred_language', 'hi');
    setUser(DEFAULT_DEMO_FARMER);
    setLanguage('hi');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user?.isLoggedIn,
      language,
      changeLanguage,
      login,
      register,
      logout,
      updateProfile,
      resetToDemoFarmer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
