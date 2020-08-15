import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomepageComponent} from './homepage/homepage.component';
import {LayoutWithSharedComponent} from './layout-with-shared/layout-with-shared.component';
import {AuthGuard} from './helper/auth-guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutWithSharedComponent,
    children: [
      {
        path: '',
        component: HomepageComponent
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
