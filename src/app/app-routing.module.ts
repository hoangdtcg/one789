import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomepageComponent} from './homepage/homepage.component';
import {LayoutWithSharedComponent} from './layout-with-shared/layout-with-shared.component';
import {AuthGuard} from './helper/auth-guard';
import {XienComponent} from './xien/xien.component';
import {DitNhatComponent} from './dit-nhat/dit-nhat.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutWithSharedComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomepageComponent
      },
      {
        path: 'xien',
        component: XienComponent
      },
      {
        path: 'dit-nhat',
        component: DitNhatComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
