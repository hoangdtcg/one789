import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user/user.service';
import {NotificationService} from '../../service/notification/notification.service';

declare var $: any;

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  listUser: any = [];
  currentUsername: string = '';
  user: any;
  username: string = '';
  role: string = '';

  constructor(private userService: UserService,
              private notificationService: NotificationService) {
    this.currentUsername = localStorage.getItem('username');
  }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.getAllUser().subscribe(listUser => {
      this.listUser = listUser;
    });
  }

  deleteUser = data => {
    this.userService.deleteUser(data);
    this.notificationService.showSuccessMessage('Đã xóa!');
    $('#modal-delete').modal('hide');
  };

  getUser(user) {
    this.user = user;
    this.username = user.payload.doc.data().username;
    this.role = user.payload.doc.data().role;
  }

  updateUser = data => {
    let input = {
      username: this.username,
      role: this.role
    };
    this.userService.updateUser(data,input);
    this.getAllUser();
    this.notificationService.showSuccessMessage('Cập nhật thành công!');
    $('#modal-update').modal('hide');
  };
}
