import { Priority, State } from './story';

export type Task = {
  id: number;
  name: string;
  description: string;
  priority: Priority;
  storyId: number;
  estimatedTime: number; //in days
  state: State;
  createdAt?: Date | { seconds: number };
  startedAt?: Date | { seconds: number } | null;
  finishedAt?: Date | { seconds: number } | null;
  assignedUserId?: number;
};
