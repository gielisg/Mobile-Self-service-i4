import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'signin', loadChildren: './signin/signin.module#SigninPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'my-detail', loadChildren: './my-detail/my-detail.module#MyDetailPageModule' },
  { path: 'my-account', loadChildren: './my-account/my-account.module#MyAccountPageModule' },
  { path: 'my-service', loadChildren: './my-service/my-service.module#MyServicePageModule' },
  { path: 'change-status', loadChildren: './change-status/change-status.module#ChangeStatusPageModule' },
  { path: 'change-plan', loadChildren: './change-plan/change-plan.module#ChangePlanPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
