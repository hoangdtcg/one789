import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaCangRoutingModule} from './ba-cang-routing.module';
import {FormsModule} from '@angular/forms';
import { BaCangComponent } from './ba-cang.component';



@NgModule({
  declarations: [BaCangComponent],
  imports: [
    CommonModule,
    BaCangRoutingModule,
    FormsModule
  ]
})
export class BaCangModule { }
