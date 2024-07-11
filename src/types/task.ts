import { Priority, State } from './story';

export type Task = {
  id: number;
  name: string;
  description: string;
  priority: Priority;
  storyId: number;
  estimatedTime: number; //in days
  state: State;
  createdAt?: Date;
  startedAt?: Date;
  finishedAt?: Date;
  assignedUserId?: number;
};
