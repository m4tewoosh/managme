import { rxjsStore } from '../store/rxjsStore';
import { Project } from '../types/project';
import { Story } from '../types/story';
import { Task } from '../types/task';
import { User } from '../types/user';

class ApiBridge {
  public saveProject(project: Project) {
    const existingStoreProjects = rxjsStore.getStoreProjects().getValue();

    if (existingStoreProjects) {
      rxjsStore.setStoreProjects([...existingStoreProjects, project]);
      return;
    }

    rxjsStore.setStoreProjects([project]);
  }

  public updateProject(project: Project) {
    const existingStoreProjects = rxjsStore.getStoreProjects().getValue();

    const updatedProject = existingStoreProjects.find(
      ({ id }) => id === project.id
    );

    if (!updatedProject) {
      return;
    }

    updatedProject.name = project.name;
    updatedProject.description = project.description;
  }

  public saveStory(story: Story) {
    const existingStoreStories = rxjsStore.getStoreStories().getValue();
    rxjsStore.setStoreStories([...existingStoreStories, story]);
  }

  public updateStory(story: Story) {
    const existingStoreStories = rxjsStore.getStoreStories().getValue();

    const updatedStory = existingStoreStories.find(({ id }) => id === story.id);

    if (!updatedStory) {
      return;
    }

    updatedStory.name = story.name;
    updatedStory.description = story.description;
    updatedStory.priority = story.priority;
    updatedStory.state = story.state;
    updatedStory.ownerId = story.ownerId;
  }

  public selectActiveProject(projectId: string) {
    rxjsStore.setStoreActiveProject(Number(projectId));
  }

  public saveUser(user: User) {
    const existingStoreUsers = rxjsStore.getStoreUsers().getValue();
    rxjsStore.setStoreUsers([...existingStoreUsers, user]);
  }

  public saveTask(task: Task) {
    const existingStoreTasks = rxjsStore.getStoreTasks().getValue();
    rxjsStore.setStoreTasks([...existingStoreTasks, task]);
  }

  public updateTask(task: Task) {
    const existingStoreTasks = rxjsStore.getStoreTasks().getValue();

    const updatedTask = existingStoreTasks.find(({ id }) => id === task.id);

    if (!updatedTask) {
      return;
    }

    updatedTask.name = task.name;
    updatedTask.description = task.description;
    updatedTask.priority = task.priority;
    updatedTask.state = task.state;
    updatedTask.assignedUserId = task.assignedUserId;
    updatedTask.estimatedTime = task.estimatedTime;
    updatedTask.storyId = task.storyId;
  }
}

export default ApiBridge;
