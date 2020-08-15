import {Component, OnInit} from '@angular/core';
import {Odds} from '../interface/odds';
import {OddsService} from '../service/odds/odds.service';
import {NumbersService} from '../service/numbers/numbers.service';
import {Numbers} from '../interface/numbers';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  listOdd: Odds[] = [];
  numbers: Numbers[] = [];

  constructor(private oddsService: OddsService,
              private numbersService: NumbersService) {
  }

  ngOnInit() {
    this.getAllOdd();
    this.numbers = this.numbersService.getAllNumber();
    console.log(this.numbers);
  }

  getAllOdd() {
    let term = this.convertDateToString(new Date());
    this.oddsService.getAllOdds(term).subscribe(listOdd => {
      this.listOdd = listOdd;
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
