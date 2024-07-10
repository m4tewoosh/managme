import { apiBridge } from '../appSetup';
import { Priority, State } from '../types/story';

class Story {
  public constructor(
    id: number,
    createdAt: Date,
    description: string,
    ownerId: number,
    name: string,
    priority: Priority,
    projectId: number,
    state: State
  ) {
    apiBridge.saveStory({
      id,
      createdAt,
      description,
      name,
      ownerId,
      priority,
      projectId,
      state,
    });
  }
}

export default Story;
