import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BillHistoryPage } from './bill-history.page';
import { MaterialShareModule } from '../materialshare.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';

import { File } from '@ionic-native/file/ngx';
import { BillService } from 'src/service/bill.service';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


const routes: Routes = [
  {
    path: '',
    component: BillHistoryPage
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
  declarations: [BillHistoryPage],
  providers: [
    AuthService,
    TranslateServiceService,
    File,
    BillService,
  ]
})
export class BillHistoryPageModule { }
