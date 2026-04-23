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
  highlights?: HighlightItem[]; 
}

//interfaces de Proyectos
export interface Project {
  id: string;
  created_at: string;
  founder_id: string;
  title: string;
  description: string | null;
  script_url: string | null;
  start_date: string | null;
  theme_color: string | null; 
  status: string;
}

// Este es el modelo para mostrar en la lista (Dashboard)
export interface ProjectSummary {
  id: string;
  title: string;
  charactersCount: number;
  status: string;
  theme_color?: string |null;
}

//interfaces de compañias
export interface Company {
  id: string;  
  name: string; 
  founder_id?: string | null; 
  created_at?: string;  
  image_url?: string | null; 
  theme_color?: string | null;
}

// 2. Los Miembros de la compañía
export interface CompanyMember {
  id: string;  
  company_id: string | null; 
  profile_id: string | null; 
  role: string | null;
  joined_at: string; 
  is_active: boolean | null;
  left_at: string | null;
}

// 3. Las Invitaciones pendientes
export interface CompanyInvitation {
  id: string;
  company_id: string | null;
  inviter_id: string | null;
  email: string;
  role: string | null;
  token: string | null;
  status: string | null; 
  created_at: string;
}
export interface CompanyNotification {
  id: string;
  company_id: string;
  inviter_id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  companies: {
    name: string;
  };
}