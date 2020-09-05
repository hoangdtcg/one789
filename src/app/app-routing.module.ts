import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomepageComponent} from './homepage/homepage.component';
import {LayoutWithSharedComponent} from './layout-with-shared/layout-with-shared.component';
import {AuthGuard} from './helper/auth-guard';
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
        loadChildren: () => import('./xien/xien.module').then(module => module.XienModule)
      },
      {
        path: 'dit-nhat',
        loadChildren: () => import('./dit-nhat/dit-nhat.module').then(module => module.DitNhatModule)

      },
      {
        path: 'users',
        loadChildren: () => import('./user/user.module').then(module => module.UserModule)
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
