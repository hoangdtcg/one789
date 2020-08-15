import { Component, OnInit } from '@angular/core';
import {UserToken} from '../../interface/user-token';
import {User} from '../../interface/user';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser: UserToken;
  user: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
