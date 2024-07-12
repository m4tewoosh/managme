import ApiBridge from './apiBridge';
import { UserRole } from '../types/user';

class User {
  public constructor(
    id: number,
    name: string,
    surname: string,
    role: UserRole
  ) {
    ApiBridge.saveUser({ id, name, surname, role });
  }
}

export default User;
