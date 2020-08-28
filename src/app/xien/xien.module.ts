import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {XienRoutingModule} from './xien-routing.module';
import {FormsModule} from '@angular/forms';
import {XienComponent} from './xien.component';



@NgModule({
  declarations: [
    XienComponent,
  ],
  imports: [
    CommonModule,
    XienRoutingModule,
    FormsModule
  ]
})
export class XienModule { }
