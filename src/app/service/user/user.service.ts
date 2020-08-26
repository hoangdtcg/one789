import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {NotificationService} from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore,
              private notificationService: NotificationService) {
  }

  createUser(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('users')
        .add(data)
        .then(() => {
          this.notificationService.showSuccessMessage('Tạo tài khoản thành công');
        }, err => reject(err));
    });
  }

  getAllUser() {
    return this.firestore.collection('users').snapshotChanges();
  }

  deleteUser(data) {
    return this.firestore
      .collection('users')
      .doc(data.payload.doc.id)
      .delete();
  }

  updateUser(data, input) {
    return this.firestore
      .collection('users')
      .doc(data.payload.doc.id)
      .set(
        {
          username: input.username,
          role: input.role
        }, {merge: true});
  }
}
