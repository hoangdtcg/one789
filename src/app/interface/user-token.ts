import {Role} from './role';

export interface UserToken {
  id?: number;
  Username?: string;
  Password?: string;
  fullName?: string;
  roles?: [Role];
  IdToken?: string;
  RefreshToken?: string;
  AccessToken?: string;
}
