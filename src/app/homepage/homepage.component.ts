import {Component, OnInit} from '@angular/core';
import {OddsService} from '../service/odds/odds.service';
import {NumbersService} from '../service/numbers/numbers.service';
import {Numbers} from '../interface/numbers';
import {Items} from '../interface/items';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  numbers: Numbers[] = [];
  filterNumbers: Numbers[] = [];
  resultNumbers: Numbers[] = [];
  waitingList: Numbers[] = [];
  resultList: string[] = [];
  items: Items[] = [];
  search: any = null;
  point: number = 0;

  constructor(private oddsService: OddsService,
              private numbersService: NumbersService) {
  }

  ngOnInit() {
    this.updateData();
    this.filterNumbers = this.numbersService.getAllNumber();
  }

  getAllOdd() {
    let term = this.convertDateToString(new Date());
    this.oddsService.getOdds(term).subscribe(odd => {
      this.numbers = this.numbersService.getAllNumber();
      this.addExtraNumberToNumber(odd);
    });
  }

  updateData() {
    this.getAllOdd();
    var self = this;
    setTimeout(function() {
      self.getAllOdd();
    }, 5000);
  }

  chooseNumber(number: Numbers) {
    number.checked = !number.checked;
    if (number.checked) {
      this.waitingList.push(number);
    } else {
      let index = this.waitingList.indexOf(number);
      if (index > -1) {
        this.waitingList.splice(index, 1);
      }
    }
  }

  moveWaitingListToResultList() {
    this.resultNumbers = this.waitingList;
    this.waitingList.map(numbers => {
      const item: Items = {
        Numbers: numbers.Number,
        Point: this.point,
        Price: numbers.ExtraPrice
      };
      this.items.push(item);
    });
    let result = '';
    for (let i = 0; i < this.waitingList.length; i++) {
      result += this.waitingList[i].Number;
      if (i != this.waitingList.length - 1) {
        result += ', ';
      }
    }
    result += 'x' + this.point;
    this.resultList.push(result);
    this.point = 0;
  }

  filterNumberBiggerThan() {
    if (this.search != null || this.search != '') {
      this.filterNumbers = [];
      this.numbers.map(number => {
        if (number.ExtraPrice >= this.search) {
          this.filterNumbers.push(number);
        }
      });
    }
    if (this.search == '') {
      this.getAllOdd();
    }
  }

  addExtraNumberToNumber(odd) {
    this.filterNumbers.map(number => {
      number.ExtraPrice = odd[0].Price;
    });
    this.filterNumbers.map(number => {
      odd[0].Numbers.map(numbers => {
        if (number.Number == numbers.Number) {
          number.ExtraPrice += numbers.ExtraPrice;
        }
      });
    });
  }

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
}
