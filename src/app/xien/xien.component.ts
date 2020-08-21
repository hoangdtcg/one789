import {Component, OnInit} from '@angular/core';
import {Numbers} from '../interface/numbers';
import {Items} from '../interface/items';

@Component({
  selector: 'app-xien',
  templateUrl: './xien.component.html',
  styleUrls: ['./xien.component.css']
})
export class XienComponent implements OnInit {
  date: Date = new Date();
  maximum: string = '';
  message: string = '';
  data: string = '';
  exportData: string = '';
  search: string = '';
  numbers: Numbers[] = [];
  filterNumbers: Numbers[] = [];
  resultNumbers: Numbers[] = [];
  items: Items[] = [];
  totalPoint: number = 0;
  totalMoney: number = 0;
  latest: any = [];
  continue: boolean = false;
  isExpired: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  searchNumber() {

  }

  submit() {

  }

  clearAll() {

  }

  cancelPlay(ticket: any) {

  }

  splitInputData() {

  }

  logout() {

  }
}
