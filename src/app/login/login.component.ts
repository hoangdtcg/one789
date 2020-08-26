import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import {UserToken} from '../interface/user-token';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {NotificationService} from '../service/notification/notification.service';
import {User} from '../interface/user';
import {UserService} from '../service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginRequest: User = {
    Username: '',
    Password: ''
  };
  returnUrl: string;
  currentUser: UserToken;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private userService: UserService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
  }

  login() {
    if (this.isExistsInFirestore(this.loginRequest.Username)) {
      this.authenticationService.login(this.loginRequest.Username, this.loginRequest.Password)
        .pipe(first())
        .subscribe(
          data => {
            sessionStorage.setItem('ACCESS_TOKEN', data.IdToken);
            localStorage.setItem('username', this.loginRequest.Username);
            this.router.navigate([this.returnUrl]).finally(() => {
            });
            this.notificationService.showSuccessMessage('Đăng nhập thành công!');
          },
          () => {
            this.notificationService.showErrorMessage('Sai tên đăng nhập hoặc mật khẩu!');
          });
    } else {
      this.notificationService.showErrorMessage('Sai tên đăng nhập hoặc mật khẩu!');
    }
  }

  isExistsInFirestore(username) {
    let isExisted = false;
    this.userService.getAllUser().subscribe(listUser => {
      listUser.map(user => {
        // @ts-ignore
        if (user.payload.doc.data().username == username) {
          isExisted = true;
        }
      });
    });
    return isExisted;
  }
}
