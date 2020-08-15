import {Component, OnInit} from '@angular/core';
import {Odds} from '../interface/odds';
import {OddsService} from '../service/odds/odds.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  listOdd: Odds[];

  constructor(private oddsService: OddsService) {
  }

  ngOnInit() {
    this.getAllOdd();
  }

  getAllOdd() {
    let term = this.convertDateToString(new Date());
    this.oddsService.getAllOdds(term).subscribe(listOdd => {
      this.listOdd = listOdd;
      console.log(this.listOdd);
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
