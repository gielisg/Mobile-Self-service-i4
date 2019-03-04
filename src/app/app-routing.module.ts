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
  { path: 'bill-history', loadChildren: './bill-history/bill-history.module#BillHistoryPageModule' },
  { path: 'transaction-history', loadChildren: './transaction-history/transaction-history.module#TransactionHistoryPageModule' },
  { path: 'pay-now', loadChildren: './pay-now/pay-now.module#PayNowPageModule' },
  { path: 'payment-method', loadChildren: './payment-method/payment-method.module#PaymentMethodPageModule' },
  { path: 'new-payment', loadChildren: './new-payment/new-payment.module#NewPaymentPageModule' },
  { path: 'call-history', loadChildren: './call-history/call-history.module#CallHistoryPageModule' },
  { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'service-bundle', loadChildren: './service-bundle/service-bundle.module#ServiceBundlePageModule' },
  { path: 'service-detail', loadChildren: './service-detail/service-detail.module#ServiceDetailPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'topup-history', loadChildren: './topup-history/topup-history.module#TopupHistoryPageModule' },
  { path: 'top-up', loadChildren: './top-up/top-up.module#TopUpPageModule' },
  { path: 'payment-update', loadChildren: './payment-update/payment-update.module#PaymentUpdatePageModule' },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'account-balance', loadChildren: './account-balance/account-balance.module#AccountBalancePageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
