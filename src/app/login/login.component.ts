import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import {UserToken} from '../interface/user-token';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {NotificationService} from '../service/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  returnUrl: string;
  currentUser: UserToken;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
  }

  login() {
    this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(first())
      .subscribe(
        data => {
          localStorage.setItem('ACCESS_TOKEN', data.IdToken);
          this.router.navigate([this.returnUrl]).finally(() => {
          });
          this.notificationService.showSuccessMessage('Đăng nhập thành công');
        },
        () => {
          this.notificationService.showSuccessMessage('Đăng nhập thành công');
        });
  }
}
