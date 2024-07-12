export type Priority = 'low' | 'medium' | 'high';

export type State = 'todo' | 'doing' | 'done';

export type Story = {
  id: number;
  createdAt?: Date;
  description: string;
  ownerId: number;
  name: string;
  priority: Priority;
  projectId?: number;
  state: State;
};
