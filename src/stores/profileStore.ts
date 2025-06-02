import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface UserProfile {
  displayName: string;
  email: string;
  bio: string;
  notificationPreferences: {
    email: boolean;
    paymentReminders: boolean;
    payoutNotifications: boolean;
    newMembers: boolean;
  };
}

interface ProfileState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  updateNotificationPreferences: (preferences: Partial<UserProfile['notificationPreferences']>) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      isLoading: false,
      error: null,

      updateProfile: async (profile) => {
        try {
          set({ isLoading: true, error: null });
          
          // Validaciones
          if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
            toast.error('Email inválido');
            return false;
          }
          
          // Simular llamada API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            userProfile: {
              ...state.userProfile,
              ...profile
            } as UserProfile,
            isLoading: false
          }));
          
          toast.success('Perfil actualizado exitosamente');
          return true;
        } catch (error) {
          console.error('Error updating profile:', error);
          set({ error: 'Error al actualizar el perfil', isLoading: false });
          return false;
        }
      },

      updateNotificationPreferences: async (preferences) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simular llamada API
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set(state => ({
            userProfile: {
              ...state.userProfile,
              notificationPreferences: {
                ...state.userProfile?.notificationPreferences,
                ...preferences
              }
            } as UserProfile,
            isLoading: false
          }));
          
          toast.success('Preferencias actualizadas');
          return true;
        } catch (error) {
          console.error('Error updating preferences:', error);
          set({ error: 'Error al actualizar preferencias', isLoading: false });
          return false;
        }
      }
    }),
    {
      name: 'pasacoin-profile',
      partialize: (state) => ({ userProfile: state.userProfile })
    }
  )
);