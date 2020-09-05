import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DitNhatComponent} from './dit-nhat.component';
import {DitNhatRoutingModule} from './dit-nhat-routing.module';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    DitNhatComponent,
  ],
  imports: [
    CommonModule,
    DitNhatRoutingModule,
    FormsModule
  ]
})
export class DitNhatModule { }
