import { apiBridge } from '../appSetup';

class Project {
  public constructor(id: number, name: string, description: string) {
    apiBridge.saveProject({ id, name, description });
  }
}

export default Project;
