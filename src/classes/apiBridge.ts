import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';
import { rxjsStore } from '../store/rxjsStore';
import { Project } from '../types/project';
import { Story } from '../types/story';
import { Task } from '../types/task';
import { User } from '../types/user';

const firebaseConfig = {
  apiKey: 'AIzaSyC5wrIz_wjc0-1Jd1JzcnP3V-gfvg8fUOg',
  authDomain: 'managme-23c99.firebaseapp.com',
  projectId: 'managme-23c99',
  storageBucket: 'managme-23c99.appspot.com',
  messagingSenderId: '979372707728',
  appId: '1:979372707728:web:e6201243f17077a66c6d15',
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

    const updatedProject = existingStoreProjects.find(
      ({ id }) => id === project.id
    );

    if (!updatedProject) {
      return;
    }

    const filteredProjects = existingStoreProjects.filter(
      ({ id }) => id !== project.id
    );

    const newProjects = [...filteredProjects, project].sort(
      (a, b) => a.id - b.id
    );

    console.log(newProjects);

    rxjsStore.setStoreProjects(newProjects);

    // updatedProject.name = project.name;
    // updatedProject.description = project.description;
  }

  public saveStory(story: Story) {
    const existingStoreStories = rxjsStore.getStoreStories().getValue();
    rxjsStore.setStoreStories([...existingStoreStories, story]);
  }

  public updateStory(story: Story) {
    const existingStoreStories = rxjsStore.getStoreStories().getValue();

    // const updatedStory = existingStoreStories.find(({ id }) => id === story.id);

    const filteredStories = existingStoreStories.filter(
      ({ id }) => id !== story.id
    );

    const newStories = [...filteredStories, story];

    rxjsStore.setStoreStories(newStories);

    // if (!updatedStory) {
    //   return;
    // }

    // updatedStory.name = story.name;
    // updatedStory.description = story.description;
    // updatedStory.priority = story.priority;
    // updatedStory.state = story.state;
    // updatedStory.ownerId = story.ownerId;
  }

  public selectActiveProject(projectId: number) {
    rxjsStore.setStoreActiveProject(projectId);
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
