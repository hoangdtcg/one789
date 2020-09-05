import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaCangComponent} from './ba-cang.component';


const routes: Routes = [
  {
    path:'',
    component: BaCangComponent
  }
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BaCangRoutingModule { }
