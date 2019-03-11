import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyServicePage } from './my-service.page';
import { MaterialShareModule } from '../materialshare.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';
import { ChangeStatusPage } from '../change-status/change-status.page';
import { ChangePlanPage } from '../change-plan/change-plan.page';
import { BillService } from 'src/service/bill.service';



export function createTranslateLoader(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const routes: Routes = [
  {
    path: '',
    component: MyServicePage
  }
];

@NgModule({
  declarations: [
    MyServicePage,
    ChangeStatusPage,
    ChangePlanPage,
  ],
  entryComponents: [
    ChangeStatusPage,
    ChangePlanPage,
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
  providers: [
    AuthService,
    TranslateServiceService,
    BillService,
  ]
})
export class MyServicePageModule { }
