import {Component, OnInit} from '@angular/core';
import {Numbers} from '../interface/numbers';
import {Items} from '../interface/items';
import {OddsService} from '../service/odds/odds.service';
import {NumbersService} from '../service/numbers/numbers.service';
import {GamePlayService} from '../service/game-play/game-play.service';
import {NotificationService} from '../service/notification/notification.service';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {CopyService} from '../service/copy/copy.service';

declare var $: any;

@Component({
  selector: 'app-xien',
  templateUrl: './xien.component.html',
  styleUrls: ['./xien.component.css']
})
export class XienComponent implements OnInit {
  numbers: Numbers[] = [];
  filterNumbers: Numbers[] = [];
  tickets: any = [];
  originTickets: any = [];
  items: Items[] = [];
  items1: Items[] = [];
  items2: Items[] = [];
  rate: string = '1';
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
              private authenticationService: AuthenticationService,
              private copyService: CopyService) {
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
    let maximum = localStorage.getItem('maximum-xien');
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
    this.exportData = this.exportStringToTextArea(this.listUnsatisfactory);
  }

  splitInputData() {
    let regex = /[^]+?(?=xien|Xien|xiên|Xiên)/;
    this.data = this.data.replace(regex, '');
    let contents = this.data.split(':');
    let isValid = contents[1] != null;
    let isValidType = contents[0] == 'Xien' || contents[0] == 'Xiên' || contents[0] == 'xiên' || contents[0] == 'xien';
    if (isValid && isValidType) {
      contents[1] = contents[1].replace('\n', '').trim();
      let rows = contents[1].split('n');
      rows.pop();
      this.pushDataToItemList(rows);
      this.numberOfInput = this.tickets.length;
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
      let priceAfterRate = (+columns[1] * +this.rate).toFixed(0) + '';
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
          let newPrice = +priceAfterRate - +this.maximum;
          if (newPrice > 0) {
            let temp: any = {
              GameType: 0,
              BetType: ticket1.BetType,
              Items: this.pushToItemsList(numbers, newPrice + '', 'price1')
            };
            this.listUnsatisfactory.push(temp);
            this.items = this.pushToItemsList(numbers, this.maximum, 'price1');
          } else {
            this.items = this.pushToItemsList(numbers, (+this.maximum * +this.rate) + '', 'price1');
          }
          ticket1.Items = this.items;
        }
        let temp: any = {
          GameType: 0,
          BetType: ticket1.BetType,
          Items: this.pushToItemsList(numbers, columns[1] + '', 'price1')
        };
        this.originTickets.push(temp);
        this.tickets.push(ticket1);
      }
      if (numbers.length == 3) {
        this.items1 = this.pushToItemsList(numbers, columns[1], 'price2');
        ticket1.BetType = 3;
        ticket1.Items = this.items1;
        if (+columns[1] > +this.maximum && +this.maximum > 0) {
          let newPrice = +priceAfterRate - +this.maximum;
          if (newPrice > 0) {
            let temp: any = {
              GameType: 0,
              BetType: ticket1.BetType,
              Items: this.pushToItemsList(numbers, newPrice + '', 'price2')
            };
            this.listUnsatisfactory.push(temp);
            this.items1 = this.pushToItemsList(numbers, this.maximum, 'price2');
          } else {
            this.items1 = this.pushToItemsList(numbers, (+this.maximum * +this.rate) + '', 'price2');
          }
          ticket1.Items = this.items1;
        }
        let temp: any = {
          GameType: 0,
          BetType: ticket1.BetType,
          Items: this.pushToItemsList(numbers, columns[1] + '', 'price2')
        };
        this.originTickets.push(temp);
        this.tickets.push(ticket1);
      }
      if (numbers.length == 4) {
        this.items2 = this.pushToItemsList(numbers, columns[1], 'price3');
        ticket1.BetType = 4;
        ticket1.Items = this.items2;
        if (+columns[1] > +this.maximum && +this.maximum > 0) {
          let newPrice = +priceAfterRate - +this.maximum;
          if (newPrice > 0) {
            let temp: any = {
              GameType: 0,
              BetType: ticket1.BetType,
              Items: this.pushToItemsList(numbers, newPrice + '', 'price3')
            };
            this.listUnsatisfactory.push(temp);
            this.items2 = this.pushToItemsList(numbers, this.maximum, 'price3');
          } else {
            this.items2 = this.pushToItemsList(numbers, (+this.maximum * +this.rate) + '', 'price3');
          }
          ticket1.Items = this.items2;
        }
        let temp: any = {
          GameType: 0,
          BetType: ticket1.BetType,
          Items: this.pushToItemsList(numbers, columns[1] + '', 'price3')
        };
        this.originTickets.push(temp);
        this.tickets.push(ticket1);
      }
      if (numbers.length < 2) {
        this.message = 'Phải nhập ít nhất 2 số';
        $('#modal-danger').modal('show');
        return;
      }
    });
  }

  pushToItemsList(numbers: any, point: string, priceType: string) {
    let itemsList = [];
    let items: Items = {};
    items.Numbers = numbers;
    items.Price = this.getNumberExtraPrice(numbers, priceType);
    if (point != null) {
      items.Point = +point;
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
    let data = {
      Term: term,
      IgnorePrice: true,
      Tickets: this.tickets
    };
    let date = this.numbersService.convertDateToString(new Date());
    localStorage.setItem('now', date);
    this.gamePlayService.play(data).subscribe(() => {
      this.notificationService.showSuccessMessage('Thành công');
    }, () => {
      this.notificationService.showErrorMessage('Xảy ra lỗi');
    });
    this.data = this.exportStringToTextArea(this.originTickets);
    this.clearAll();
    this.reloadTicketsLatestList();
  }

  clearAll() {
    this.getAllOdd();
    this.items = [];
    this.totalPoint = 0;
    this.totalMoney = 0;
    this.rate = '1';
    this.numberOfInput = 0;
    this.listUnsatisfactory = [];
    this.tickets = [];
  }

  exportStringToTextArea(tickets) {
    let result = '';
    if (tickets.length != 0) {
      result += 'Xiên:';
      for (let i = 0; i < tickets.length; i++) {
        result += this.exportOneLine(tickets[i]);
        if (i != tickets.length - 1) {
          result += '\n';
        }
      }
    }
    return result;
  }

  exportOneLine(tickets) {
    let result = '';
    result += tickets.Items[0].Numbers;
    result += 'x' + tickets.Items[0].Point + 'n';
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

  getNumberExtraPrice(numbers: any, price) {
    let extraPrice = 0;
    let count = 0;
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < this.filterNumbers.length; j++) {
        if (this.filterNumbers[j].Number == numbers[i]) {
          if (price == 'price1') {
            count++;
            extraPrice += this.filterNumbers[j].price1;
          }
          if (price == 'price2') {
            count++;
            extraPrice += this.filterNumbers[j].price2;
          }
          if (price == 'price3') {
            count++;
            extraPrice += this.filterNumbers[j].price3;
          }
        }
      }
    }
    extraPrice /= count;
    return +extraPrice.toFixed(0);
  }

  copyDataToClipboard(inputElement) {
    this.copyService.copyInputMessage(inputElement);
  }

  saveMaximumToLocalStorage() {
    localStorage.setItem('maximum-xien', this.maximum);
  }
}
