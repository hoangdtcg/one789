import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  username: string = '';
  hasRoleAdmin: boolean = false;

  constructor(private userService: UserService) {
    this.username = localStorage.getItem('username');
  }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    this.userService.getAllUser().subscribe(listUser => {
      listUser.map(user => {
        // @ts-ignore
        if (user.payload.doc.data().username == this.username) {
          // @ts-ignore
          if (user.payload.doc.data().role == 'admin') {
            this.hasRoleAdmin = true;
          }
        }
      });
    });
  }
}
