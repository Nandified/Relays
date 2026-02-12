import type { ProOnboardingData } from "@/lib/types";

export type UserRole = "consumer" | "pro";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  proOnboarding?: ProOnboardingData;
}
