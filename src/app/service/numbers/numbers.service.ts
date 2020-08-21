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

  convertDateToString(date: Date): string {
    let term = date.getUTCFullYear() + '-';
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    if (month < 10) {
      term += '0';
    }
    term += month + '-';
    if (day < 10) {
      term += '0';
    }
    term += day;
    return term;
  }

  getPairOfNumberArray(array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        let arrayTemp = [];
        arrayTemp.push(array[i]);
        arrayTemp.push(array[j]);
        result.push(arrayTemp);
      }
    }
    return result;
  }

  getThreeDifferentNumber(array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        for (let k = j + 1; k < array.length; k++) {
          let arrayTemp = [];
          arrayTemp.push(array[i]);
          arrayTemp.push(array[j]);
          arrayTemp.push(array[k]);
          result.push(arrayTemp);
        }
      }
    }
    return result;
  }

  getFourDifferentNumber(array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        for (let k = j + 1; k < array.length; k++) {
          for(let n = k+1;n<array.length;n++){
            let arrayTemp = [];
            arrayTemp.push(array[i]);
            arrayTemp.push(array[j]);
            arrayTemp.push(array[k]);
            arrayTemp.push(array[n]);
            result.push(arrayTemp);
          }
        }
      }
    }
    return result;
  }
}
