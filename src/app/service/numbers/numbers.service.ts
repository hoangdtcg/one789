import {Injectable} from '@angular/core';
import {Numbers} from '../../interface/numbers';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor() {
  }

  getAllNumber() {
    let numbers = [];
    for (let i = 0; i < 10; i++) {
      const number: Numbers = {
        Number: '0' + i,
        ExtraPrice: 0
      };
      numbers.push(number);
    }
    for (let i = 10; i < 100; i++) {
      const number: Numbers = {
        Number: i + '',
        ExtraPrice: 0
      };
      numbers.push(number);
    }
    return numbers;
  }

  compareTo = (a: Numbers, b: Numbers) => {
    return a.Number < b.Number ? 1 : -1;
  };
}
