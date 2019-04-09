import { Base } from './base.model';

export class User extends Base {
  fullname: string;
  email: string;
  roles: string[];
}
