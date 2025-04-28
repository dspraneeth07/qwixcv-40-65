
export type UserRole = 'student' | 'organization' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  profilePicture?: string;
  createdAt?: string; // Adding this to fix type issues
}
