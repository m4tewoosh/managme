import { apiBridge } from '../appSetup';
import { UserRole } from '../types/user';

class User {
  public constructor(
    id: number,
    name: string,
    surname: string,
    role: UserRole
  ) {
    apiBridge.saveUser({ id, name, surname, role });
  }
}

export default User;
