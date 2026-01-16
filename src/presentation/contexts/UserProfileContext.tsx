import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userProfileService } from '../../services/auth/userProfileService';

interface UserProfile {
    displayName: string;
    emailAddress: string;
    id: string;
    imageUrl: string;
    coreAttributes?: any;
}

interface UserProfileContextData {
    userProfile: UserProfile | null;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextData>({} as UserProfileContextData);

interface UserProfileProviderProps {
    children: ReactNode;
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const profile = await userProfileService.getUserProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            setUserProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const refreshProfile = async () => {
        await fetchUserProfile();
    };

    return (
        <UserProfileContext.Provider value={{ userProfile, isLoading, refreshProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    const context = useContext(UserProfileContext);

    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }

    return context;
}
