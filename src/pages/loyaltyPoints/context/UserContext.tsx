import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the user type
type User = {
  id: string;
  name: string;
  email: string;
  plan: 'A' | 'B' | 'C';
  loyaltyEnabled: boolean;
  points: number;
  userType: 'marketer' | 'customer';
};

// Define the context type
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  activateLoyalty: () => void;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: '123',
  name: 'Ahmed Hassan',
  email: 'ahmed@example.com',
  plan: 'C',
  loyaltyEnabled: false,
  points: 0,
  userType: 'customer'
};

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);

  const activateLoyalty = () => {
    if (user && user.plan === 'C') {
      setUser({
        ...user,
        loyaltyEnabled: true,
        points: 150 // Give some initial points for demo purposes
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, activateLoyalty }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};