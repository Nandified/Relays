export type UserRole = "consumer" | "pro";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
