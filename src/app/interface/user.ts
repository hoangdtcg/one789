import {Role} from './role';

export interface User {
  id?: number;
  Username?: string;
  Password?: string;
  fullName?: string;
  roles?: [Role];
}
