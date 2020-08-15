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
  data: string = '';

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
      this.filterNumbers.map(number => {
        this.numbers.map(number1 => {
          number.ExtraPrice = number1.ExtraPrice;
        });
      });
    });
  }

  updateData() {
    this.getAllOdd();
    var self = this;
    setTimeout(function() {
      self.getAllOdd();
    }, 5000);
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
    this.numbers.map(number => {
      number.ExtraPrice = odd[0].Price;
    });
    this.numbers.map(number => {
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

  searchNumber() {
    this.data = this.data.replace('\n', '');
    let rows = this.data.split('n');
    rows.pop();
    rows.map(row => {
      const columns = row.split('x');
      const numbers = columns[0].split(',');
      numbers.map(number => {
        let items: Items = {};
        number = number.trim();
        this.filterNumbers.map(number1 => {
          if (number1.Number == number) {
            items.Numbers = number;
            items.Price = number1.ExtraPrice;
            number1.checked = true;
            number1.point = +columns[1];
            this.resultNumbers.push(number1);
            let index = this.filterNumbers.indexOf(number1);
            this.filterNumbers.splice(index, 1);
          }
        });
        if (columns[1] != null) {
          items.Point = +columns[1];
        }
        this.items.push(items);
      });
    });
    this.data = '';
  }
}
