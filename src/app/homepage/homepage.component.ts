import {Component, OnInit} from '@angular/core';
import {OddsService} from '../service/odds/odds.service';
import {NumbersService} from '../service/numbers/numbers.service';
import {Numbers} from '../interface/numbers';
import {Items} from '../interface/items';
import {GamePlayService} from '../service/game-play/game-play.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  numbers: Numbers[] = [];
  filterNumbers: Numbers[] = [];
  resultNumbers: Numbers[] = [];
  items: Items[] = [];
  search: any = null;
  data: string = '';
  point: number = 0;
  totalPoint: number = 0;

  constructor(private oddsService: OddsService,
              private numbersService: NumbersService,
              private gamePlayService: GamePlayService) {
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
          if (number1.Number == number.Number) {
            number.ExtraPrice = number1.ExtraPrice;
          }
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

  filterNumberLowerThan() {
    let numberBigger = [];
    this.filterNumbers.map(number => {
      let flag = -1;
      if (number.ExtraPrice <= this.search) {
        flag = 1;
        number.checked = true;
        number.point = this.point;
        this.resultNumbers.push(number);
      }
      if (flag == -1) {
        numberBigger.push(number);
      }
    });
    this.filterNumbers = numberBigger;
    let result = '';
    for (let i = 0; i < numberBigger.length; i++) {
      result += numberBigger[i].Number;
      if (i != numberBigger.length - 1) {
        result += ', ';
      }
    }
    result += 'x' + this.point + 'n';
    this.data = result;
    this.sumTotalPoint();
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
            items.Numbers = [number];
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
    this.sumTotalPoint();
    this.data = '';
  }

  sumTotalPoint() {
    this.resultNumbers.map(number => {
      this.totalPoint += +number.point;
    });
  }

  submit() {
    let term = this.convertDateToString(new Date());
    let data = {
      Term: term,
      IgnorePrice: true,
      Tickets:
        [
          {
            GameType: 0,
            BetType: 0,
            Items: this.items
          }
        ]
    };
    this.gamePlayService.play(data).subscribe(() => {
      console.log('success');
      this.clearAll();
      this.data = '';
    }, () => {
      console.log('error');
    });
  }

  clearAll() {
    this.filterNumbers = this.numbersService.getAllNumber();
    this.getAllOdd();
    this.resultNumbers = [];
    this.items = [];
    this.totalPoint = 0;
    this.search = '';
  }
}
