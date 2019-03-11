import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SigninPage } from './signin.page';
import { MaterialShareModule } from '../materialshare.module';
import { TranslaterModule } from '../translater.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';

export function createTranslateLoader(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


const routes: Routes = [
  {
    path: '',
    component: SigninPage
  }
];

@NgModule({
  entryComponents: [
    ForgotPasswordPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes)
  ],
  providers: [
    TranslateServiceService,
    AuthService,
  ],
  declarations: [
    SigninPage,
    ForgotPasswordPage,
  ]
})
export class SigninPageModule { }
