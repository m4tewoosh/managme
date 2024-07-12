import ApiBridge from './apiBridge';

class Project {
  public constructor(id: number, name: string, description: string) {
    ApiBridge.saveProject({ id, name, description });
  }
}

export default Project;
