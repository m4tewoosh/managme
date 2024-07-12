export type UserRole = 'admin' | 'devops' | 'developer';

export type User = {
  id: number;
  name: string;
  surname: string;
  role: UserRole;
};
