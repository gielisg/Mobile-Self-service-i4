import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentUpdatePage } from './payment-update.page';
import { MaterialShareModule } from '../materialshare.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';
import { PaymentService } from 'src/service/payment.service';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';


export function createTranslateLoader(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const routes: Routes = [
  {
    path: '',
    component: PaymentUpdatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaterialShareModule,
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
  declarations: [PaymentUpdatePage],
  providers: [
    TranslateServiceService,
    PaymentService,
    LoadingService,
    ToastService,
    AuthService,
  ]
})
export class PaymentUpdatePageModule { }
