import type { ProOnboardingData } from "@/lib/types";

export type UserRole = "consumer" | "pro" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  proOnboarding?: ProOnboardingData;
}
