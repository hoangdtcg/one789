import {Injectable} from '@angular/core';
import {NotificationService} from './notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  constructor(private notificationService: NotificationService) {
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    let textMessage = 'Đoạn văn bản đã được copy vào clipboard';
    this.notificationService.showSuccessMessage(textMessage);

  }

  textMessageFunc(text: string) {
  }
}
