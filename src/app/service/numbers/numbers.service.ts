import {Injectable} from '@angular/core';
import {Numbers} from '../../interface/numbers';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {
  numbers: Numbers[] = [];

  constructor() {
  }

  getAllNumber() {
    for (let i = 0; i < 10; i++) {
      const number: Numbers = {
        Number: '0' + i,
        ExtraPrice: 0
      };
      this.numbers.push(number);
    }
  }
}
