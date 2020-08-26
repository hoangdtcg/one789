import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import {UserToken} from '../interface/user-token';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {UserService} from '../service/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  currentUser: UserToken;
  isValid: boolean = false;

  constructor(private router: Router,
              private authService: AuthenticationService,
              private userService: UserService) {
    this.authService.currentUser.subscribe(
      user => {
        this.currentUser = user;
        this.userService.getAllUser().subscribe(listUser => {
          listUser.map(user1 => {
            // @ts-ignore
            if (this.currentUser.Username == user1.payload.doc.data().username) {
              this.isValid = true;
            }
          });
        });
      }
    );
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isValid) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/', 'login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isValid) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/', 'user', 'login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]) {
    return true;
  }
}
