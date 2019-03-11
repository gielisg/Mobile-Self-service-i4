import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PayNowPage } from './pay-now.page';
import { MaterialShareModule } from '../materialshare.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { PaymentService } from 'src/service/payment.service';
import { LoadingService } from 'src/service/loading.service';
import { AuthService } from 'src/service/auth.service';
import { ToastService } from 'src/service/toast.service';


export function createTranslateLoader(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const routes: Routes = [
  {
    path: '',
    component: PayNowPage
  }
];

@NgModule({
  entryComponents: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    PayNowPage,
  ],
  providers: [
    TranslateServiceService,
    PaymentService,
    LoadingService,
    AuthService,
    ToastService,
  ]
})
export class PayNowPageModule { }
