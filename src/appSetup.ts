import ApiBridge from './classes/apiBridge';
import Project from './classes/project';
import Story from './classes/story';
import Task from './classes/task';
import User from './classes/user';

export const apiBridge = new ApiBridge();

// task model:
// id,
// name,
// description,
// priority,
// storyId,
// estimatedTime,
// state,
// createdAt,
// startedAt,
// finishedAt,
// assignedUserId,

const appSetup = () => {
  new User(1, 'Mateusz', 'Nowak', 'admin');
  new User(2, 'John', 'Doe', 'developer');
  new User(3, 'Jan', 'Kowalski', 'devops');

  // project 1 + stories + tasks:
  new Project(1, 'Car project', 'Lets build new V12 engine');
  new Story(
    1,
    new Date(Date.now()),
    'Prepare fuel injectors according to the book',
    2,
    'Fuel injectors',
    'high',
    1,
    'todo'
  );

  new Story(
    2,
    new Date(Date.now()),
    'Prepare engine block mock using 3D software',
    2,
    'Engine block',
    'high',
    1,
    'todo'
  );

  new Task(
    1,
    'Buy book about fuel injectors',
    'Fuel injectors book is needed to properly set them in our new V12 engines',
    'high',
    1,
    1,
    'todo',
    new Date(Date.now())
  );

  // project 2 + stories + tasks:
  new Project(2, 'Coding project', 'Lets build ECU for V12 engine ');
  new Story(
    2,
    new Date(Date.now()),
    'Organize folder structure, bundler and repository',
    1,
    'Start the project',
    'high',
    2,
    'todo'
  );

  apiBridge.selectActiveProject('1');
};

export default appSetup;