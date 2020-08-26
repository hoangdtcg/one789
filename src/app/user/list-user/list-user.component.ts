import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user/user.service';

declare var $: any;

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  listUser: any = [];
  username: string = '';
  user: any;

  constructor(private userService: UserService) {
    this.username = localStorage.getItem('username');
  }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.getAllUser().subscribe(listUser => {
      this.listUser = listUser;
      $(function() {
        $('#table-user').DataTable({
          'paging': true,
          'lengthChange': false,
          'searching': false,
          'ordering': true,
          'info': true,
          'autoWidth': false,
        });
      });
    });
  }

  deleteUser = data => {
    this.userService.deleteUser(data);
    $('#modal-delete').modal('hide');
  };

  getUser(user) {
    this.user = user;
  }
}
