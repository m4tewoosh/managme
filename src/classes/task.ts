import ApiBridge from './apiBridge';
import { Priority, State } from '../types/story';

class Task {
  public constructor(
    id: number,
    name: string,
    description: string,
    priority: Priority,
    storyId: number,
    estimatedTime: number, //in days
    state: State,
    createdAt: Date,
    startedAt?: Date,
    finishedAt?: Date,
    assignedUserId?: number
  ) {
    ApiBridge.saveTask({
      id,
      name,
      description,
      priority,
      storyId,
      estimatedTime,
      state,
      createdAt,
      startedAt,
      finishedAt,
      assignedUserId,
    });
  }
}

export default Task;
