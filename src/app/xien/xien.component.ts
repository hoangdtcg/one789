import {Component, OnInit} from '@angular/core';
import {Numbers} from '../interface/numbers';
import {Items} from '../interface/items';
import {OddsService} from '../service/odds/odds.service';
import {NumbersService} from '../service/numbers/numbers.service';
import {GamePlayService} from '../service/game-play/game-play.service';
import {NotificationService} from '../service/notification/notification.service';
import {AuthenticationService} from '../service/authentication/authentication.service';

declare var $: any;

@Component({
  selector: 'app-xien',
  templateUrl: './xien.component.html',
  styleUrls: ['./xien.component.css']
})
export class XienComponent implements OnInit {
  numbers: Numbers[] = [];
  filterNumbers: Numbers[] = [];
  resultNumbers: Numbers[] = [];
  tickets: any = [];
  items: Items[] = [];
  items1: Items[] = [];
  items2: Items[] = [];
  search: string = '';
  data: string = '';
  totalPoint: number = 0;
  totalMoney: number = 0;
  exportData: string = '';
  date: Date = new Date();
  latest: any = [];
  listUnsatisfactory: any = [];
  numberOfInput: number = 0;
  maximum: string = '';
  message: string = '';
  continue: boolean = false;
  isExpired: boolean = false;

  constructor(private oddsService: OddsService,
              private numbersService: NumbersService,
              private gamePlayService: GamePlayService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService) {
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
    let numberInLocalStorage = JSON.parse(localStorage.getItem('xien'));
    let term = this.numbersService.convertDateToString(new Date());
    this.oddsService.getOdds(term, 2).subscribe(odd => {
      this.numbers = this.numbersService.getAllNumber();
      this.addExtraNumberToPrice(odd, 1);
      this.oddsService.getOdds(term, 3).subscribe(odd2 => {
        this.addExtraNumberToPrice(odd2, 2);
        this.oddsService.getOdds(term, 4).subscribe(odd3 => {
          this.addExtraNumberToPrice(odd3, 3);
          this.filterNumbers.map(number => {
            this.numbers.map(number1 => {
              if (number1.Number == number.Number) {
                number.price1 = number1.price1;
                number.price2 = number1.price2;
                number.price3 = number1.price3;
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
        });
      });
    }, () => {
      this.message = 'Đã hết phiên đăng nhập! Hãy đăng nhập lại';
      this.isExpired = true;
    });
  }

  updateData() {
    this.getAllOdd();
    this.getTicketsLatest();
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
        localStorage.removeItem('xien');
        localStorage.removeItem('contents');
      } else {
        if (isLowerMonth) {
          localStorage.setItem('now', this.numbersService.convertDateToString(currentTime));
          localStorage.removeItem('xien');
          localStorage.removeItem('contents');
        } else {
          if (isLowerYear) {
            localStorage.setItem('now', this.numbersService.convertDateToString(currentTime));
            localStorage.removeItem('xien');
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

  addExtraNumberToPrice(odd, price) {
    this.numbers.map(number => {
      if (price == 1) {
        number.price1 = odd[0].Price;
      }
      if (price == 2) {
        number.price2 = odd[0].Price;
      }
      if (price == 3) {
        number.price3 = odd[0].Price;
      }
    });
    this.numbers.map(number => {
      odd[0].Numbers.map(numbers => {
        if (price == 1) {
          if (number.Number == numbers.Number) {
            number.price1 += numbers.ExtraPrice;
          }
        }
        if (price == 2) {
          if (number.Number == numbers.Number) {
            number.price2 += numbers.ExtraPrice;
          }
        }
        if (price == 3) {
          if (number.Number == numbers.Number) {
            number.price3 += numbers.ExtraPrice;
          }
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
    let contents = this.data.split(':');
    let isValid = contents[1] != null;
    let isValidType = contents[0] == 'Xien' || contents[0] == 'Xiên' || contents[0] == 'xiên' || contents[0] == 'xien';
    if (isValid && isValidType) {
      contents[1] = contents[1].replace('\n', '').trim();
      let rows = contents[1].split('n');
      rows.pop();
      this.pushDataToItemList(rows);
      this.numberOfInput = this.tickets.length;
      this.filterNumberLowerThan();
      this.sumTotalPointAndTotalMoney();
      this.data = '';
      $('#modal-danger').modal('hide');
    } else {
      this.message = 'Xin hãy nhập như mẫu sau: Xiên: 01,02x1n';
      $('#modal-danger').modal('show');
    }
  }

  pushDataToItemList(rows: string[]) {
    rows.map(row => {
      const columns = row.split('x');
      const numbers = columns[0].split(',');
      let ticket1: any = {
        GameType: 0
      };
      for (let i = 0; i < numbers.length; i++) {
        numbers[i] = numbers[i].trim();
      }
      if (numbers.length == 2) {
        this.items = this.pushToItemsList(numbers, columns[1], 'price1');
        ticket1.BetType = 2;
        ticket1.Items = this.items;
        if (+columns[1] > +this.maximum && +this.maximum > 0) {
          let newPrice = +columns[1] - +this.maximum;
          let temp: any = {
            GameType: 0,
            BetType: ticket1.BetType,
            Items: this.pushToItemsList(numbers, newPrice + '', 'price1')
          };
          this.listUnsatisfactory.push(temp);
          this.items = this.pushToItemsList(numbers, this.maximum, 'price1');
          ticket1.Items = this.items;
        }
        this.tickets.push(ticket1);
      }
      if (numbers.length == 3) {
        this.items1 = this.pushToItemsList(numbers, columns[1], 'price2');
        ticket1.BetType = 3;
        ticket1.Items = this.items1;
        if (+columns[1] > +this.maximum && +this.maximum > 0) {
          this.listUnsatisfactory.push(ticket1);
          let newPrice = +columns[1] - +this.maximum;
          let temp: any = {
            GameType: 0,
            BetType: ticket1.BetType,
            Items: this.pushToItemsList(numbers, newPrice + '', 'price2')
          };
          this.listUnsatisfactory.push(temp);
          this.items1 = this.pushToItemsList(numbers, this.maximum, 'price2');
          ticket1.Items = this.items1;
        }
        this.tickets.push(ticket1);
      }
      if (numbers.length == 4) {
        this.items2 = this.pushToItemsList(numbers, columns[1], 'price3');
        ticket1.BetType = 4;
        ticket1.Items = this.items2;
        if (+columns[1] > +this.maximum && +this.maximum > 0) {
          this.listUnsatisfactory.push(ticket1);
          let newPrice = +columns[1] - +this.maximum;
          let temp: any = {
            GameType: 0,
            BetType: ticket1.BetType,
            Items: this.pushToItemsList(numbers, newPrice + '', 'price3')
          };
          this.listUnsatisfactory.push(temp);
          this.items2 = this.pushToItemsList(numbers, this.maximum, 'price3');
          ticket1.Items = this.items2;
        }
        this.tickets.push(ticket1);
      }
      this.exportData = this.exportStringToTextArea(this.listUnsatisfactory);
      if (numbers.length < 2) {
        this.message = 'Phải nhập ít nhất 2 số';
        $('#modal-danger').modal('hide');
        return;
      }
    });
  }

  pushToItemsList(xien: any, price: string, priceType: string) {
    let itemsList = [];
    let items: Items = {};
    items.Numbers = xien;
    items.Price = this.getNumberExtraPrice(xien[0], priceType);
    if (price != null) {
      items.Point = +price;
    }
    itemsList.push(items);
    return itemsList;
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
    this.tickets.map(ticket => {
      this.totalPoint += ticket.Items[0].Point;
      this.totalMoney += ticket.Items[0].Point * ticket.Items[0].Price;
    });
  }

  submit() {
    let term = this.numbersService.convertDateToString(new Date());
    for (let i = 0; i < this.tickets.length; i++) {
      let data = {
        Term: term,
        IgnorePrice: true,
        Tickets: [this.tickets[i]]
      };
      let date = this.numbersService.convertDateToString(new Date());
      localStorage.setItem('now', date);
      this.gamePlayService.play(data).subscribe(() => {
        this.notificationService.showSuccessMessage('Thành công');
        let localStorageArray = JSON.parse(localStorage.getItem('numbers'));
        if (localStorageArray == null) {
          localStorage.setItem('xien', JSON.stringify(this.resultNumbers));
        } else {
          localStorageArray = JSON.parse(localStorage.getItem('xien'));
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
            localStorage.setItem('xien', JSON.stringify(localStorageArray));
          });
        }
      }, () => {
        this.notificationService.showErrorMessage('Xảy ra lỗi');
      });
    }
    this.data = this.exportStringToTextArea(this.tickets);
    this.clearAll();
    this.reloadTicketsLatestList();
  }

  clearAll() {
    this.getAllOdd();
    this.items = [];
    this.totalPoint = 0;
    this.totalMoney = 0;
    this.search = '';
    this.numberOfInput = 0;
    this.listUnsatisfactory = [];
    this.tickets = [];
  }

  exportStringToTextArea(tickets) {
    let result = 'Xiên:';
    for (let i = 0; i < tickets.length; i++) {
      result += this.exportOneLine(tickets);
      if (i != tickets.length - 1) {
        result += '\n';
      }
    }
    return result;
  }

  exportOneLine(tickets) {
    let result = '';
    result += tickets[0].Items[0].Numbers;
    result += 'x' + tickets[0].Items[0].Point + 'n';
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
            BetType: ticket.BetType,
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

  getNumberExtraPrice(number: any, price) {
    let extraPrice = 0;
    for (let i = 0; i < this.filterNumbers.length; i++) {
      if (this.filterNumbers[i].Number == number) {
        if (price == 'price1') {
          extraPrice = this.filterNumbers[i].price1;
          break;
        }
        if (price == 'price2') {
          extraPrice = this.filterNumbers[i].price2;
          break;
        }
        if (price == 'price3') {
          extraPrice = this.filterNumbers[i].price3;
          break;
        }
      }
    }
    return extraPrice;
  }
}
