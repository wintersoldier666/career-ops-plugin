import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, Application, PipelineEntry, Conversation } from '../types';

const KEYS = {
  API_KEY: 'career_ops_api_key',
  PROFILE: 'career_ops_profile',
  RESUME_TEXT: 'career_ops_resume_text',
  APPLICATIONS: 'career_ops_applications',
  PIPELINE: 'career_ops_pipeline',
  CONVERSATIONS: 'career_ops_conversations',
  RESEARCH: 'career_ops_research',
} as const;

// ─── API Key ────────────────────────────────────────────────────────────────

export async function getApiKey(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.API_KEY);
}

export async function setApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.API_KEY, key.trim());
}

export async function clearApiKey(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.API_KEY);
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
  const raw = await AsyncStorage.getItem(KEYS.PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.PROFILE, KEYS.RESUME_TEXT]);
}

// ─── Resume Text ─────────────────────────────────────────────────────────────

export async function getResumeText(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.RESUME_TEXT);
}

export async function saveResumeText(text: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.RESUME_TEXT, text);
}

// ─── Applications ────────────────────────────────────────────────────────────

export async function getApplications(): Promise<Application[]> {
  const raw = await AsyncStorage.getItem(KEYS.APPLICATIONS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
}

export async function saveApplication(app: Application): Promise<void> {
  const apps = await getApplications();
  const idx = apps.findIndex((a) => a.id === app.id);
  if (idx >= 0) {
    apps[idx] = app;
  } else {
    apps.unshift(app);
  }
  await AsyncStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
}

export async function updateApplicationStatus(
  id: string,
  status: Application['status'],
  extra?: Partial<Application>
): Promise<void> {
  const apps = await getApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx >= 0) {
    apps[idx] = { ...apps[idx], status, ...extra };
    await AsyncStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const apps = await getApplications();
  const filtered = apps.filter((a) => a.id !== id);
  await AsyncStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(filtered));
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export async function getPipeline(): Promise<PipelineEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.PIPELINE);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PipelineEntry[];
  } catch {
    return [];
  }
}

export async function savePipelineEntries(entries: PipelineEntry[]): Promise<void> {
  const existing = await getPipeline();
  const merged = [...entries, ...existing].reduce<PipelineEntry[]>((acc, e) => {
    if (!acc.find((x) => x.url === e.url)) acc.push(e);
    return acc;
  }, []);
  await AsyncStorage.setItem(KEYS.PIPELINE, JSON.stringify(merged));
}

// ─── Conversations ────────────────────────────────────────────────────────────

export async function getConversations(): Promise<Conversation[]> {
  const raw = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export async function saveConversation(conv: Conversation): Promise<void> {
  const convs = await getConversations();
  const idx = convs.findIndex((c) => c.id === conv.id);
  if (idx >= 0) {
    convs[idx] = conv;
  } else {
    convs.unshift(conv);
  }
  // Keep only last 50 conversations
  const trimmed = convs.slice(0, 50);
  await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(trimmed));
}

export async function deleteConversation(id: string): Promise<void> {
  const convs = await getConversations();
  const filtered = convs.filter((c) => c.id !== id);
  await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(filtered));
}

// ─── Research ─────────────────────────────────────────────────────────────────

export async function getResearch(companySlug: string): Promise<string | null> {
  const raw = await AsyncStorage.getItem(KEYS.RESEARCH);
  if (!raw) return null;
  try {
    const research = JSON.parse(raw) as Record<string, string>;
    return research[companySlug] ?? null;
  } catch {
    return null;
  }
}

export async function saveResearch(companySlug: string, content: string): Promise<void> {
  const raw = await AsyncStorage.getItem(KEYS.RESEARCH);
  const research: Record<string, string> = raw ? JSON.parse(raw) : {};
  research[companySlug] = content;
  await AsyncStorage.setItem(KEYS.RESEARCH, JSON.stringify(research));
}

// ─── Utilities ───────────────────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEYS.PROFILE,
    KEYS.RESUME_TEXT,
    KEYS.APPLICATIONS,
    KEYS.PIPELINE,
    KEYS.CONVERSATIONS,
    KEYS.RESEARCH,
  ]);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
