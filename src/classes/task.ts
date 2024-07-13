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
    createdAt: Date
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
    });
  }
}

export default Task;
