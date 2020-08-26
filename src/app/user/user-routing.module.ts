import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListUserComponent} from './list-user/list-user.component';
import {CreateUserComponent} from './create-user/create-user.component';


const routes: Routes = [
  {
    path: '',
    component: ListUserComponent
  },
  {
    path: 'create',
    component: CreateUserComponent
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
