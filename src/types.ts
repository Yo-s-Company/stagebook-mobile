// src/types.ts

export interface ThemeColors {
  bg: string;
  text: string;
  primary: string;
  secondary: string;
}

export interface UserProfileData {
  displayName: string; 
  artisticName: string; 
  description: string; 
  avatar_url?: string; 
  birthPlace: string;
  age: string;
}

export interface Contact {
  type: 'instagram' | 'linkedin' | 'web' | 'email' | 'teléfono';
  value: string;
}

// Interfaces específicas para los Modales
export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentData: UserProfileData;
  theme: ThemeColors;
  onSave: (updatedData: UserProfileData) => Promise<void>;
}

export interface ManageSocialModalProps {
  visible: boolean;
  onClose: () => void;
  theme: ThemeColors;
  contacts: Contact[];
}

export type TabType = 'book' | 'obras' | 'proyectos';

//interfaces de ProfileHeader
export interface HighlightItem {
  id: string;
  name: string;
  icon: string;
}

export interface ProfileHeaderProps {
  userData: UserProfileData;
  theme: ThemeColors;
  onEdit: () => void;
  // Añadimos esto si quieres pasar los highlights por props en el futuro
  highlights?: HighlightItem[]; 
}