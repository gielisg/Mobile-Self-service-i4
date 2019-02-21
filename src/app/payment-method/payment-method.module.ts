import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodPage } from './payment-method.page';
import { PaymentService } from 'src/service/payment.service';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';

import { MaterialShareModule } from '../materialshare.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';
import { PaymentUpdatePage } from '../payment-update/payment-update.page';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodPage
  }
];

@NgModule({
  entryComponents: [
    PaymentUpdatePage
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
  declarations: [
    PaymentMethodPage,
    PaymentUpdatePage
  ],
  providers: [
    TranslateServiceService,
    PaymentService,
    LoadingService,
    ToastService,
    AuthService,
  ]
})
export class PaymentMethodPageModule { }
