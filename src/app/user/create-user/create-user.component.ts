import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user/user.service';

declare var $: any;

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  username: string = '';
  role: string = '';
  isValid: boolean = true;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    $(document).ready(function() {
      $('#user-form').validate({
        rules: {
          username: {
            required: true
          },
          role: {
            required: true
          }
        },
        messages: {
          username: {
            required: 'Hãy nhập tên tài khoản'
          },
          role: {
            required: 'Hãy cấp quyền cho tài khoản'
          }
        },
        errorElement: 'span',
        errorPlacement: function(error, element) {
          error.addClass('invalid-feedback');
          element.closest('.form-group').append(error);
        },
        highlight: function(element, errorClass, validClass) {
          $(element).addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
          $(element).removeClass('is-invalid');
        }
      });
    });
  }

  createUser() {
    let data: any = {
      username: this.username,
      role: this.role
    };
    if (this.username == '' && this.role == '') {
      this.isValid = false;
    }
    if (this.isValid) {
      this.userService.createUser(data)
        .then();
    }
  }
}
