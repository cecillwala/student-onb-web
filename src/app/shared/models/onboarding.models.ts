export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  route: string;
}

export interface StudentInfo {
  name: string;
  regNo: string;
  programme: string;
  department: string;
  faculty: string;
  indexNo: string;
}

export interface TrackingStage {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'pending' | 'flagged';
  date?: string;
  note?: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 1, title: 'Personal Details', description: 'Basic info, address & guardian', icon: 'person', route: 'personal' },
  { id: 2, title: 'ID Verification', description: 'National ID & selfie', icon: 'badge', route: 'id-verification' },
  { id: 3, title: 'Academic Details', description: 'Study mode & interests', icon: 'school', route: 'academic' },
  { id: 4, title: 'Accommodation', description: 'Housing preferences', icon: 'home', route: 'accommodation' },
  { id: 5, title: 'Health Details', description: 'Medical info & insurance', icon: 'local_hospital', route: 'health' },
  { id: 6, title: 'Document Upload', description: 'Certificates & letters', icon: 'upload_file', route: 'documents' },
];

// Colour tokens used throughout the app
export const COLORS = {
  primary: '#1E40AF',
  primaryDark: '#1E3A8A',
  primaryLight: '#3B82F6',
  primaryBg: '#EFF6FF',
  primaryBorder: '#BFDBFE',

  accent: '#0F766E',
  accentLight: '#14B8A6',

  bg: '#F7F8FA',
  white: '#FFFFFF',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',

  green: '#059669',
  greenLight: '#D1FAE5',
  greenBorder: '#A7F3D0',

  warning: '#D97706',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',

  danger: '#DC2626',
};