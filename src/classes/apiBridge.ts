import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { rxjsStore } from '../store/rxjsStore';
import { Project } from '../types/project';
import { Story } from '../types/story';
import { Task } from '../types/task';
import { User } from '../types/user';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'managme-23c99.firebaseapp.com',
  projectId: 'managme-23c99',
  storageBucket: 'managme-23c99.appspot.com',
  messagingSenderId: '979372707728',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

class ApiBridge {
  firebaseApp;
  db;

  public constructor() {
    this.firebaseApp = initializeApp(firebaseConfig);
    this.db = getFirestore(this.firebaseApp);
  }

  public async saveProject(project: Project) {
    const projectsRef = collection(this.db, 'projects');
    await setDoc(doc(projectsRef, String(project.id)), project);

    const existingStoreProjects = rxjsStore.getStoreProjects().getValue();

    if (existingStoreProjects) {
      rxjsStore.setStoreProjects([...existingStoreProjects, project]);
      return;
    }

    rxjsStore.setStoreProjects([project]);
  }

  public async updateProject(project: Project) {
    const projectsRef = collection(this.db, 'projects');
    await setDoc(doc(projectsRef, String(project.id)), project);

    const existingStoreProjects = rxjsStore.getStoreProjects().getValue();

    const filteredProjects = existingStoreProjects.filter(
      ({ id }) => id !== project.id
    );

    const newProjects = [...filteredProjects, project].sort(
      (a, b) => a.id - b.id
    );

    rxjsStore.setStoreProjects(newProjects);
  }

  public async deleteProject(projectId: number) {
    const projectsRef = collection(this.db, 'projects');
    const storiesRef = collection(this.db, 'stories');

    const existingStoreStories = rxjsStore.getStoreStories().getValue();
    const existingStoreTasks = rxjsStore.getStoreTasks().getValue();

    console.log(projectId);

    console.log(existingStoreStories);
    const projectRelatedStories = existingStoreStories.filter(
      (story) => story.projectId === projectId
    );

    await deleteDoc(doc(projectsRef, String(projectId)));

    console.log(projectRelatedStories);

    projectRelatedStories.forEach(async (story) => {
      await deleteDoc(doc(storiesRef, String(story.id)));

      const tasksToDelete = existingStoreTasks.filter(
        (task) => task.storyId === story.id
      );
      await this.deleteStoryTasks(tasksToDelete);
    });
  }

  public async saveStory(story: Story) {
    const storiesRef = collection(this.db, 'stories');
    await setDoc(doc(storiesRef, String(story.id)), story);

    const existingStoreStories = rxjsStore.getStoreStories().getValue();
    rxjsStore.setStoreStories([...existingStoreStories, story]);
  }

  public async updateStory(story: Story) {
    const existingStoreStories = rxjsStore.getStoreStories().getValue();
    const updatedStory = existingStoreStories.find(({ id }) => id === story.id);

    const newStory = {
      ...story,
      createdAt: updatedStory?.createdAt,
      projectId: updatedStory?.projectId,
    };

    const storiesRef = collection(this.db, 'stories');
    await setDoc(doc(storiesRef, String(newStory.id)), newStory);

    const filteredStories = existingStoreStories.filter(
      ({ id }) => id !== story.id
    );
    const newStories = [...filteredStories, newStory];

    rxjsStore.setStoreStories(newStories);
  }

  public async deleteStory(storyId: number) {
    const storiesRef = collection(this.db, 'stories');
    await deleteDoc(doc(storiesRef, String(storyId)));
  }

  public selectActiveProject(projectId: number) {
    rxjsStore.setStoreActiveProject(projectId);
  }

  public saveUser(user: User) {
    const existingStoreUsers = rxjsStore.getStoreUsers().getValue();
    rxjsStore.setStoreUsers([...existingStoreUsers, user]);
  }

  public async saveTask(task: Task) {
    const tasksRef = collection(this.db, 'tasks');
    await setDoc(doc(tasksRef, String(task.id)), task);

    const existingStoreTasks = rxjsStore.getStoreTasks().getValue();
    rxjsStore.setStoreTasks([...existingStoreTasks, task]);
  }

  public async updateTask(task: Task) {
    const existingStoreTasks = rxjsStore.getStoreTasks().getValue();
    const updatedTask = existingStoreTasks.find(({ id }) => id === task.id);

    console.log(updatedTask);

    const newTask = {
      ...task,
      createdAt: updatedTask?.createdAt,
      startedAt: task.startedAt || updatedTask?.startedAt,
      finishedAt: task.finishedAt || updatedTask?.finishedAt || null,
    };

    const tasksRef = collection(this.db, 'tasks');
    await setDoc(doc(tasksRef, String(newTask.id)), newTask);

    const filteredTasks = existingStoreTasks.filter(({ id }) => id !== task.id);
    const newTasks = [...filteredTasks, newTask];

    rxjsStore.setStoreTasks(newTasks);
  }

  public async deleteTask(taskId: number) {
    const tasksRef = collection(this.db, 'tasks');
    await deleteDoc(doc(tasksRef, String(taskId)));
  }

  public deleteStoryTasks(tasksToDelete: Task[]) {
    const tasksRef = collection(this.db, 'tasks');

    tasksToDelete.forEach(async (task) => {
      await deleteDoc(doc(tasksRef, String(task.id)));
    });
  }

  public async getDBUsers() {
    const usersSnapshot = await getDocs(collection(this.db, 'users'));

    const dbUsers = usersSnapshot.docs.map((doc) => {
      const data = doc.data();

      const userDoc: User = {
        id: Number(doc.id),
        name: data.name,
        surname: data.surname,
        role: data.role,
      };

      return userDoc;
    });

    return dbUsers;
  }

  public async getDBProjects() {
    const projectsSnapshot = await getDocs(collection(this.db, 'projects'));

    const dbProjects = projectsSnapshot.docs.map((doc) => {
      const data = doc.data();

      const projectDoc: Project = {
        id: Number(doc.id),
        name: data.name,
        description: data.description,
      };

      return projectDoc;
    });

    return dbProjects;
  }

  public async getDBStories() {
    const storiesSnapshot = await getDocs(collection(this.db, 'stories'));

    const dbStories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();

      const storyDoc: Story = {
        id: Number(doc.id),
        createdAt: data?.createdAt,
        description: data.description,
        ownerId: data.ownerId,
        name: data.name,
        priority: data.priority,
        projectId: data.projectId,
        state: data.state,
      };

      return storyDoc;
    });

    return dbStories;
  }

  public async getDBTasks() {
    const tasksSnapshot = await getDocs(collection(this.db, 'tasks'));

    const dbTasks = tasksSnapshot.docs.map((doc) => {
      const data = doc.data();

      const taskDoc: Task = {
        id: Number(doc.id),
        name: data.name,
        description: data.description,
        priority: data.priority,
        storyId: data.storyId,
        estimatedTime: data.estimatedTime,
        state: data.state,
        createdAt: data?.createdAt,
        startedAt: data?.startedAt,
        finishedAt: data?.finishedAt,
        assignedUserId: data?.assignedUserId,
      };

      return taskDoc;
    });

    return dbTasks;
  }
}

export default new ApiBridge();
