import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListUserComponent} from './list-user/list-user.component';


const routes: Routes = [
  {
    path: '',
    component: ListUserComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class UserRoutingModule {
}
