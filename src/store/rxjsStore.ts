import { BehaviorSubject } from 'rxjs';
import { Story } from '../types/story';
import { Project } from '../types/project';
import { User } from '../types/user';
import { Task } from '../types/task';

const activeProjectGlobalStore = new BehaviorSubject(0);
const storiesGlobalStore = new BehaviorSubject<Story[] | []>([]);
const projectsGlobalStore = new BehaviorSubject<Project[] | []>([]);
const usersGlobalStore = new BehaviorSubject<User[] | []>([]);
const tasksGlobalStore = new BehaviorSubject<Task[] | []>([]);

const getStoreActiveProject = () => {
  return activeProjectGlobalStore;
};

const setStoreActiveProject = (newValue: number) => {
  activeProjectGlobalStore.next(newValue);
};

const getStoreStories = () => {
  return storiesGlobalStore;
};

const setStoreStories = (newValue: Story[]) => {
  storiesGlobalStore.next(newValue);
};

const getStoreProjects = () => {
  return projectsGlobalStore;
};

const setStoreProjects = (newValue: Project[]) => {
  projectsGlobalStore.next(newValue);
};

const getStoreUsers = () => {
  return usersGlobalStore;
};

const setStoreUsers = (newValue: User[]) => {
  usersGlobalStore.next(newValue);
};

const getStoreTasks = () => {
  return tasksGlobalStore;
};

const setStoreTasks = (newValue: Task[]) => {
  tasksGlobalStore.next(newValue);
};

export const rxjsStore = {
  getStoreActiveProject,
  getStoreStories,
  getStoreProjects,
  getStoreUsers,
  getStoreTasks,
  setStoreActiveProject,
  setStoreStories,
  setStoreProjects,
  setStoreUsers,
  setStoreTasks,
};
