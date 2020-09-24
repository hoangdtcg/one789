import {Component, OnInit} from '@angular/core';
import {OddsService} from '../service/odds/odds.service';
import {NumbersService} from '../service/numbers/numbers.service';
import {Numbers} from '../interface/numbers';
import {Items} from '../interface/items';
import {GamePlayService} from '../service/game-play/game-play.service';
import {NotificationService} from '../service/notification/notification.service';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {CopyService} from '../service/copy/copy.service';

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
  numberNotSubmit: Numbers[] = [];
  numberInput: Numbers[] = [];
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
  message: string = '';
  continue: boolean = false;
  isExpired: boolean = false;
  exportListNumberNotSubmit: string = '';

  constructor(private oddsService: OddsService,
              private numbersService: NumbersService,
              private gamePlayService: GamePlayService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private copyService: CopyService) {
  }

  ngOnInit() {
    this.updateData();
    let numberInLocalStorage = JSON.parse(localStorage.getItem('de'));
    this.filterNumbers = this.numbersService.getAllNumber();
    this.filterNumbers.map(number => {
      number.totalPoint = 0;
      this.numbers.map(number1 => {
        if (number1.Number == number.Number) {
          number.ExtraPrice = number1.ExtraPrice;
        }
      });
      if (numberInLocalStorage != null) {
        numberInLocalStorage.map(number1 => {
          if (number1.Number == number.Number) {
            number.totalPoint = number1.point;
          }
        });
      }
    });
    this.sort(this.filterNumbers);
  }

  getTicketsLatest() {
    this.gamePlayService.getTicketsLatest().subscribe(latest => {
      this.latest = latest;
    });
  }

  getAllOdd() {
    let numberInLocalStorage = JSON.parse(localStorage.getItem('de'));
    let term = this.numbersService.convertDateToString(new Date());
    this.oddsService.getOdds(term, 0, 0).subscribe(odd => {
      this.numbers = this.numbersService.getAllNumber();
      this.addExtraNumberToNumber(odd);
      this.filterNumbers.map(number => {
        number.totalPoint = 0;
        this.numbers.map(number1 => {
          if (number1.Number == number.Number) {
            number.ExtraPrice = number1.ExtraPrice;
          }
        });
        if (numberInLocalStorage != null) {
          numberInLocalStorage.map(number1 => {
            if (number1.Number == number.Number) {
              number.totalPoint = number1.point;
            }
          });
        }
      });
    }, () => {
      this.message = 'Đã hết phiên đăng nhập! Hãy đăng nhập lại';
      this.isExpired = true;
    });
    this.sort(this.filterNumbers);
  }

  sort(numbers: Numbers[]) {
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers.length; j++) {
        if (numbers[i].totalPoint > numbers[j].totalPoint) {
          let temp = numbers[i];
          numbers[i] = numbers[j];
          numbers[j] = temp;
        }
      }
    }
  }

  updateData() {
    this.getAllOdd();
    this.getTicketsLatest();
    let maximum = localStorage.getItem('maximum-de');
    let search = localStorage.getItem('search-de');
    if (search != null) {
      this.search = search;
    }
    if (maximum != null) {
      this.maximum = maximum;
    }
    let self = this;
    setInterval(function() {
      self.getAllOdd();
      self.deleteLocalStorageAfterNextDay();
    }, 1000);
  }

  deleteLocalStorageAfterNextDay() {
    let date = localStorage.getItem('now');
    let currentTime = new Date();
    let convertToDate = new Date(date);
    let isLowerDate = convertToDate.getUTCDate() < currentTime.getUTCDate();
    let isLowerMonth = convertToDate.getUTCMonth() < currentTime.getUTCMonth();
    let isLowerYear = convertToDate.getUTCFullYear() < currentTime.getUTCFullYear();
    if (date != null) {
      if (isLowerDate) {
        localStorage.setItem('now', this.numbersService.convertDateToString(currentTime));
        localStorage.removeItem('de');
        localStorage.removeItem('xien');
        localStorage.removeItem('dit-nhat');
        localStorage.removeItem('ba-cang');
        localStorage.removeItem('contents');
      } else {
        if (isLowerMonth) {
          localStorage.setItem('now', this.numbersService.convertDateToString(currentTime));
          localStorage.removeItem('de');
          localStorage.removeItem('xien');
          localStorage.removeItem('dit-nhat');
          localStorage.removeItem('ba-cang');
          localStorage.removeItem('contents');
        } else {
          if (isLowerYear) {
            localStorage.setItem('now', this.numbersService.convertDateToString(currentTime));
            localStorage.removeItem('de');
            localStorage.removeItem('xien');
            localStorage.removeItem('dit-nhat');
            localStorage.removeItem('ba-cang');
            localStorage.removeItem('contents');
          }
        }
      }
    }
  }

  reloadTicketsLatestList() {
    const self = this;
    setTimeout(function() {
      self.getTicketsLatest();
    }, 2000);
  }

  filterNumberLowerThan() {
    if (this.search != '' && this.search != 'null') {
      let numbers = [];
      this.resultNumbers.map(number => {
        numbers.push(number);
      });
      numbers.map(number => {
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

  searchNumber() {
    let contentInLocalStorage = JSON.parse(localStorage.getItem('contents'));
    if (contentInLocalStorage == null) {
      let array = [];
      array.push(this.data);
      localStorage.setItem('contents', JSON.stringify(array));
      this.splitInputData();
    } else {
      contentInLocalStorage = JSON.parse(localStorage.getItem('contents'));
      if (contentInLocalStorage.indexOf(this.data) == -1) {
        contentInLocalStorage.push(this.data);
        localStorage.setItem('contents', JSON.stringify(contentInLocalStorage));
        this.splitInputData();
      } else {
        this.message = 'Thông tin vừa nhập có thể đã bị trùng! Xin hãy kiểm tra lại';
        this.continue = true;
        $('#modal-danger').modal('show');
      }
    }
  }

  splitInputData() {
    let regex = /[^]+?(?=de|De|Đề|đề)/;
    this.data = this.data.replace(regex, '');
    let contents = this.data.split(':');
    let isValid = contents[1] != null;
    let isValidType = contents[0].includes('De') || contents[0].includes('Đề') || contents[0].includes('de') || contents[0].includes('đề');
    if (isValid && isValidType) {
      contents[1] = contents[1].replace('\n', '').trim();
      let rows = contents[1].split('n');
      rows.pop();
      this.pushDataToItemList(rows);
      this.resultNumbers.map(number => {
        let items: Items = {};
        items.Numbers = [number.Number];
        items.Price = number.ExtraPrice;
        if (number.point != null) {
          if (this.maximum != '' && this.maximum != "null") {
            items.Point = +this.maximum > number.point ? number.point : +this.maximum;
          } else {
            items.Point = number.point;
          }
        }
        this.items.push(items);
      });
      for (let i = 0; i < this.numbers.length; i++) {
        let flag = 0;
        for (let j = 0; j < this.numberInput.length; j++) {
          if (this.numbers[i].Number == this.numberInput[j].Number) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          this.numberNotSubmit.push(this.numbers[i]);
        }
      }
      this.exportListNumberNotSubmit = this.convertListToString(this.numberNotSubmit);
      this.sumTotalPointAndTotalMoney();
      this.data = '';
      $('#modal-danger').modal('hide');
    } else {
      this.message = 'Xin hãy nhập như mẫu sau: Đề: 01,02x1n';
      $('#modal-danger').modal('show');
    }
  }

  pushDataToItemList(rows: string[]) {
    rows.map(row => {
      const columns = row.split('x');
      const numbers = columns[0].split(',');
      numbers.map(number => {
        number = number.trim();
        this.getResultNumbers(number, +columns[1]);
        this.filterNumberLowerThan();
        let input: Numbers = {
          Number: number
        };
        this.numberInput.push(input);
      });
      this.numberOfInput += numbers.length;
    });
  }

  getResultNumbers(number: string, point: number) {
    this.filterNumbers.map(number1 => {
      let temp = number1;
      let isEqualNumberValue = temp.Number == number;
      if (isEqualNumberValue) {
        this.pushNumberToUnsatisfactoryList(point, temp);
        this.pushDifferentNumberToResultList(temp);
      }
    });
  }

  pushNumberToUnsatisfactoryList(point: number, temp: Numbers) {
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
    if (this.listUnsatisfactory.length != 0) {
      this.exportData = this.exportStringToTextArea(this.listUnsatisfactory);
    }
  }

  pushDifferentNumberToResultList(temp: Numbers) {
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
    let term = this.numbersService.convertDateToString(new Date());
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
    let date = this.numbersService.convertDateToString(new Date());
    localStorage.setItem('now', date);
    this.gamePlayService.play(data).subscribe(() => {
      this.notificationService.showSuccessMessage('Thành công');
      this.data = this.exportStringToTextArea(this.resultNumbers);
      let localStorageArray = JSON.parse(localStorage.getItem('de'));
      if (localStorageArray == null) {
        localStorage.setItem('de', JSON.stringify(this.resultNumbers));
      } else {
        localStorageArray = JSON.parse(localStorage.getItem('de'));
        this.resultNumbers.map(number => {
          let index = this.isTheSameNumber(number, localStorageArray);
          if (index != -1) {
            localStorageArray[index].point += number.point;
          } else {
            let numberTemp: Numbers = {
              Number: number.Number,
              point: number.point,
              checked: false,
              ExtraPrice: number.ExtraPrice
            };
            localStorageArray.push(numberTemp);
          }
          localStorage.setItem('de', JSON.stringify(localStorageArray));
        });
      }
      this.clearAll();
    }, () => {
      this.notificationService.showErrorMessage('Xảy ra lỗi');
    });
    this.reloadTicketsLatestList();
  }

  clearAll() {
    this.getAllOdd();
    this.resultNumbers = [];
    this.items = [];
    this.totalPoint = 0;
    this.totalMoney = 0;
    this.numberOfInput = 0;
    this.listUnsatisfactory = [];
  }

  convertListToString(numbers: Numbers[]) {
    let string = '';
    for (let i = 0; i < numbers.length; i++) {
      string += numbers[i].Number;
      if (i != numbers.length - 1) {
        string += ', ';
      }
    }
    return string;
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
    let result = 'Đề:';
    for (let i = 0; i < arrayPoint.length; i++) {
      const numberHasSamePointArray = [];
      for (let j = 0; j < numbers.length; j++) {
        if (arrayPoint[i] == numbers[j].point) {
          numberHasSamePointArray.push(numbers[j]);
        }
      }
      result += this.exportOneLine(numberHasSamePointArray);
      if (i != numbers.length - 1) {
        result += ' ';
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
      let term = this.numbersService.convertDateToString(new Date());
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

  logout() {
    this.authenticationService.logout();
  }

  saveMaximumToLocalStorage() {
    localStorage.setItem('maximum-de', this.maximum);
  }

  copyDataToClipboard(inputElement) {
    this.copyService.copyInputMessage(inputElement);
  }

  saveSearchToLocalStorage() {
    localStorage.setItem('search-de', this.search);
  }
}
