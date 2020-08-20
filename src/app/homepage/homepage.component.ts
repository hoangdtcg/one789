import {Component, OnInit} from '@angular/core';
import {OddsService} from '../service/odds/odds.service';
import {NumbersService} from '../service/numbers/numbers.service';
import {Numbers} from '../interface/numbers';
import {Items} from '../interface/items';
import {GamePlayService} from '../service/game-play/game-play.service';
import {NotificationService} from '../service/notification/notification.service';

declare var $: any;

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
  search: string = '';
  data: string = '';
  totalPoint: number = 0;
  totalMoney: number = 0;
  exportData: string = '';
  date: Date = new Date();
  latest: any = [];
  listUnsatisfactory: Numbers[] = [];
  numberOfInput: number = 0;
  maximum: string = '';

  constructor(private oddsService: OddsService,
              private numbersService: NumbersService,
              private gamePlayService: GamePlayService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.updateData();
    this.filterNumbers = this.numbersService.getAllNumber();
  }

  getTicketsLatest() {
    this.gamePlayService.getTicketsLatest().subscribe(latest => {
      this.latest = latest;
    });
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
    this.getTicketsLatest();
    let self = this;
    setInterval(function() {
      self.getAllOdd();
    }, 1000);
  }

  reloadTicketsLatestList() {
    const self = this;
    setTimeout(function() {
      self.getTicketsLatest();
    }, 2000);
  }

  filterNumberLowerThan() {
    if (this.search != '') {
      this.resultNumbers.map(number => {
        let flag = -1;
        if (number.ExtraPrice <= (+this.search)) {
          flag = 1;
        }
        if (flag == -1) {
          this.listUnsatisfactory.push(number);
          let index = this.resultNumbers.indexOf(number);
          this.resultNumbers.splice(index, 1);
        }
      });
      this.exportData = this.exportStringToTextArea(this.listUnsatisfactory);
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
    let contents = this.data.split(':');
    let isValid = contents[1] != null;
    let isValidType = contents[0] != 'De' || contents[0] != 'Đề';
    if (isValid && isValidType) {
      contents[1] = contents[1].replace('\n', '').trim();
      let rows = contents[1].split('n');
      rows.pop();
      rows.map(row => {
        const columns = row.split('x');
        const numbers = columns[0].split(',');
        numbers.map(number => {
          let items: Items = {};
          number = number.trim();
          this.getResultNumbers(number, items, +columns[1]);
          if (columns[1] != null) {
            items.Point = +columns[1];
          }
          this.items.push(items);
        });
      });
      this.numberOfInput = this.resultNumbers.length;
      this.filterNumberLowerThan();
      this.sumTotalPointAndTotalMoney();
      this.data = '';
    } else {
      $('#modal-danger').modal('show');
    }
  }

  private getResultNumbers(number: string, items: Items, point: number) {
    this.filterNumbers.map(number1 => {
      let temp = number1;
      let isEqualNumberValue = temp.Number == number;
      if (isEqualNumberValue) {
        items.Numbers = [number];
        items.Price = temp.ExtraPrice;
        this.pushNumberToUnsatisfactoryList(point, temp);
        this.pushDifferentNumberToResultList(temp);
      }
    });
  }

  private pushNumberToUnsatisfactoryList(point: number, temp: Numbers) {
    let isGreaterThanMaximum = point > +this.maximum;
    let isPositiveNumber = +this.maximum > 0;
    if (isGreaterThanMaximum && isPositiveNumber) {
      temp.point = +this.maximum;
      let temp1: Numbers = {
        Number: temp.Number,
        point: point - +this.maximum,
        checked: temp.checked,
        ExtraPrice: temp.ExtraPrice
      };
      this.listUnsatisfactory.push(temp1);
    } else {
      temp.point = point;
    }
  }

  private pushDifferentNumberToResultList(temp: Numbers) {
    let index = this.isTheSameNumber(temp, this.resultNumbers);
    if (index != -1) {
      this.resultNumbers[index].point += temp.point;
    } else {
      let numberTemp: Numbers = {
        Number: temp.Number,
        point: temp.point,
        checked: true,
        ExtraPrice: temp.ExtraPrice
      };
      this.resultNumbers.push(numberTemp);
    }
  }

  isTheSameNumber(number: Numbers, listNumber: Numbers[]) {
    let index = -1;
    for (let i = 0; i < listNumber.length; i++) {
      if (listNumber[i].Number == number.Number) {
        index = i;
        break;
      }
    }
    return index;
  }

  sumTotalPointAndTotalMoney() {
    this.resultNumbers.map(number => {
      this.totalPoint += +number.point;
      this.totalMoney += number.point * number.ExtraPrice;
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
      this.notificationService.showSuccessMessage('Thành công');
      this.data = this.exportStringToTextArea(this.resultNumbers);
      this.clearAll();
    }, () => {
      this.notificationService.showErrorMessage('Xảy ra lỗi');
    });
    this.reloadTicketsLatestList();
  }

  clearAll() {
    this.filterNumbers = this.numbersService.getAllNumber();
    this.getAllOdd();
    this.resultNumbers = [];
    this.items = [];
    this.totalPoint = 0;
    this.totalMoney = 0;
    this.search = '';
    this.numberOfInput = 0;
    this.listUnsatisfactory = [];
  }

  exportStringToTextArea(numbers) {
    let arrayPoint = [];
    for (let i = 0; i < numbers.length; i++) {
      let flag = 0;
      for (let j = i + 1; j < numbers.length - 1; j++) {
        if (numbers[i].point == numbers[j].point) {
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        if (i == numbers.length - 1) {
          let index = arrayPoint.indexOf(numbers[i].point);
          if (index == -1) {
            arrayPoint.push(numbers[i].point);
          }
        } else {
          arrayPoint.push(numbers[i].point);
        }
      }
    }
    let result = '';
    for (let i = 0; i < arrayPoint.length; i++) {
      const numberHasSamePointArray = [];
      for (let j = 0; j < numbers.length; j++) {
        if (arrayPoint[i] == numbers[j].point) {
          numberHasSamePointArray.push(numbers[j]);
        }
      }
      result += this.exportOneLine(numberHasSamePointArray);
      if (i != numbers.length - 1) {
        result += '\n';
      }
    }
    return result;
  }

  exportOneLine(numbers) {
    let result = '';
    for (let i = 0; i < numbers.length; i++) {
      result += numbers[i].Number;
      if (i != numbers.length - 1) {
        result += ', ';
      }
    }
    result += 'x' + numbers[0].point + 'n';
    return result;
  }


  isLessThanFiveMinutes(ticket: any) {
    let currentTime = new Date().getTime();
    let createDate = new Date(ticket.CreatedAt).getTime();
    return (currentTime - createDate) < 300000;
  }

  cancelPlay(ticket: any) {
    if (this.isLessThanFiveMinutes(ticket)) {
      let term = this.convertDateToString(new Date());
      let data = {
        Term: term,
        Tickets: [
          {
            GameType: 0,
            BetType: 0,
            TicketNumber: ticket.TicketNumber
          }
        ]
      };
      this.gamePlayService.cancelTicket(data).subscribe(() => {
        this.notificationService.showSuccessMessage('Hủy thành công');
        this.reloadTicketsLatestList();
      }, () => {
        this.notificationService.showErrorMessage('Hủy thất bại');
      });
    } else {
      this.notificationService.showErrorMessage('Quá 5 phút không thể hủy được');
    }
  }
}
