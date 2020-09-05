import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DitNhatComponent} from './dit-nhat.component';


const routes: Routes = [
  {
    path: '',
    component: DitNhatComponent
  }
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DitNhatRoutingModule { }
