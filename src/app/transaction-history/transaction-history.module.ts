import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionHistoryPage } from './transaction-history.page';
import { AuthService } from 'src/service/auth.service';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

import { MaterialShareModule } from '../materialshare.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/service/transaction.service';


export function createTranslateLoader(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const routes: Routes = [
  {
    path: '',
    component: TransactionHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
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
  declarations: [TransactionHistoryPage],
  providers: [
    AuthService,
    LoadingService,
    ToastService,
    TranslateServiceService,
    TransactionService,
  ]
})
export class TransactionHistoryPageModule { }
