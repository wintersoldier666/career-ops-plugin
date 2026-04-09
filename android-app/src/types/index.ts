export type SkillId =
  | 'setup'
  | 'evaluate'
  | 'tailor'
  | 'scan'
  | 'triage'
  | 'apply'
  | 'research'
  | 'outreach'
  | 'compare';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  skillId: SkillId;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkHistoryItem {
  title: string;
  company: string;
  start_date: string;
  end_date: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  field?: string;
}

export interface Profile {
  name: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  current_title?: string;
  current_company?: string;
  years_experience?: number;
  target_role?: string;
  target_industries?: string[];
  location_preference?: string;
  salary_target?: string;
  salary_minimum?: string;
  top_skills?: string[];
  work_history?: WorkHistoryItem[];
  education?: Education[];
  certifications?: string[];
  narrative_headline?: string;
  visa_status?: string;
  persona_modifiers?: {
    recent_graduate?: boolean;
    career_changer?: boolean;
    career_returner?: boolean;
    international?: boolean;
  };
}

export type ApplicationStatus =
  | 'Evaluated'
  | 'Resume Ready'
  | 'Applied'
  | 'Responded'
  | 'Interview'
  | 'Offer'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn'
  | 'Skipped';

export interface Application {
  id: string;
  dateAdded: string;
  dateApplied?: string;
  company: string;
  role: string;
  score?: number;
  status: ApplicationStatus;
  notes?: string;
  evaluationId?: string;
}

export interface PipelineEntry {
  id: string;
  dateFound: string;
  company: string;
  role: string;
  relevanceScore?: number;
  quickScore?: number;
  url: string;
  status: 'New' | 'Triaged' | 'Evaluated' | 'Skipped';
}

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  SkillChat: { skillId: SkillId; title: string; conversationId?: string };
  ConversationHistory: { skillId: SkillId };
};

export type MainTabParamList = {
  Home: undefined;
  Track: undefined;
  Settings: undefined;
};
