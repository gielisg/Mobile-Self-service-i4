import { Injectable, Inject } from '@angular/core';
import { User, APP_CONFIG, IAppConfig } from '../model';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public http: Http,
    public httpclient: HttpClient,
    private platform: Platform,
    private nativeHTTP: HTTP,
  ) { }


  getTransactionHistory() {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
      "TransactionType": "R",
    };
    return new Promise((resolve, reject) => {
      if (this.platform.is('android') && this.platform.is('ios')) {
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Financial.svc/rest/FinancialTransactionListByReceipt',
          param,
          {}
        ).then(result => {
          console.log(result);
          if (result.data.charAt(0) != '{') {
            result.data = result.data.substr(1);
          }
          resolve(JSON.parse(result.data));
        }, error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        this.httpclient.post<any>(
          this.config.apiEndpointWeb + 'Financial.svc/rest/FinancialTransactionListByReceipt',
          JSON.stringify(param)
        ).subscribe(result => {
          console.log(result);
          resolve(result);
        }, error => {
          console.log(error);
          reject(error.error);
        });
      }
    });
  }


  returnErrorState(error) {
    if (error.error.charAt(0) != '{' && error.status != 'he host could not be resolved') {
      error.error = error.error.substr(1);
    }
    if (error.status == 1) {
      return (error.error);
    } else {
      return (JSON.parse(error.error));
    }
  }


}
