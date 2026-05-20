import { create } from 'zustand';
import { UserProfile, NotificationItem } from '../types';

interface SettingsState {
  profile: UserProfile;
  notifications: NotificationItem[];
  isAuthenticated: boolean;
  login: (name: string, email: string, avatar?: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addNotification: (noti: Omit<NotificationItem, 'id' | 'date' | 'read'>) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  resetAll: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  currency: '₹',
  occupation: '',
  email: '',
  avatar: ''
};

const getInitialProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem('vq_profile');
    return stored ? JSON.parse(stored) : defaultProfile;
  } catch {
    return defaultProfile;
  }
};

const getInitialNotifications = (): NotificationItem[] => {
  try {
    const stored = localStorage.getItem('vq_notifications');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const checkInitialAuth = (): boolean => {
  try {
    return localStorage.getItem('vq_logged_in') === 'true';
  } catch {
    return false;
  }
};

export const useSettingsStore = create<SettingsState>((set) => ({
  profile: getInitialProfile(),
  notifications: getInitialNotifications(),
  isAuthenticated: checkInitialAuth(),

  login: (name, email, avatar) => set((state) => {
    const newProfile = { ...state.profile, name, email, avatar: avatar || '' };
    localStorage.setItem('vq_profile', JSON.stringify(newProfile));
    localStorage.setItem('vq_logged_in', 'true');
    return { profile: newProfile, isAuthenticated: true };
  }),

  logout: () => set(() => {
    localStorage.removeItem('vq_logged_in');
    return { isAuthenticated: false };
  }),

  updateProfile: (updated) => set((state) => {
    const newProfile = { ...state.profile, ...updated };
    localStorage.setItem('vq_profile', JSON.stringify(newProfile));
    return { profile: newProfile };
  }),

  addNotification: (noti) => set((state) => {
    const newNoti: NotificationItem = {
      ...noti,
      id: `noti-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    const newNotifications = [newNoti, ...state.notifications];
    localStorage.setItem('vq_notifications', JSON.stringify(newNotifications));
    return { notifications: newNotifications };
  }),

  markNotificationsAsRead: () => set((state) => {
    const updated = state.notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem('vq_notifications', JSON.stringify(updated));
    return { notifications: updated };
  }),

  clearNotifications: () => set(() => {
    localStorage.setItem('vq_notifications', JSON.stringify([]));
    return { notifications: [] };
  }),

  resetAll: () => {
    localStorage.setItem('vq_profile', JSON.stringify(defaultProfile));
    localStorage.setItem('vq_notifications', JSON.stringify([]));
    localStorage.removeItem('vq_logged_in');
    set({ profile: defaultProfile, notifications: [], isAuthenticated: false });
  }
}));
