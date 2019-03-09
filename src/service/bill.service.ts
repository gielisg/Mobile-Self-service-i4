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
export class BillService {

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public http: Http,
    public httpclient: HttpClient,
    private nativeHTTP: HTTP,
    private platform: Platform,
  ) {

  }

  getServiceDisplay() {
    let param = { "SessionKey": (localStorage.getItem("sessionKey")) };

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.nativeHTTP.setDataSerializer('json');
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Bill.svc/rest/BillList',
          (param),
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
        this.httpclient.post(
          this.config.apiEndpointWeb + 'Bill.svc/rest/BillList',
          JSON.stringify(param)
        ).subscribe(result => {
          console.log(result);
          resolve(result);
        }, error => {
          console.log(error);
          reject(error.error);
        });
      }
    })

    // return this.httpclient.post(
    //   this.config.apiEndpointWeb + 'Bill.svc/rest/BillList',
    //   JSON.stringify(param))
    //   .pipe(
    //   );
  }

  getBill() {
    let request_param = {
      'SessionKey': (localStorage.getItem('sessionKey')),
      // 'SessionKey': (localStorage.getItem('sessionKey')),
      'PagingSortsAndFilters': {
        'SkipRecords': 0,
        'PropertyName': {},
        'Sort': {
          'Direction': 'Descending',
          'TargetProperty': 'Id',
        },
        'TakeRecords': 1,
      }
    };

    return new Promise((resolve, reject) => {
      console.log(this.platform);
      if (this.platform.is('cordova')) {
        this.nativeHTTP.setDataSerializer('json');
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Bill.svc/rest/BillList',
          request_param,
          {}
        ).then(result => {
          console.log(result);
          if (result.data.charAt(0) != '{') {
            result.data = result.data.substr(1);
          }
          console.log(JSON.parse(result.data));
          resolve(JSON.parse(result.data));
        }).catch(error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        return this.httpclient.post(
          this.config.apiEndpointWeb + 'Bill.svc/rest/BillList',
          JSON.stringify(request_param)
        ).subscribe(result => {
          console.log(result);
          resolve(result);
        }, error => {
          reject(error.error);
        });
      }
    });
  }

  getBillList() {
    let request_param = {
      "SessionKey": (localStorage.getItem("sessionKey")),
      "PagingSortsAndFilters": {
        "SkipRecords": 0,
        "PropertyName": {},
        "Sort": {
          "Direction": "Descending",
          "TargetProperty": "Id",
        },
        "TakeRecords": 50,
      }
    };
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.nativeHTTP.setDataSerializer('json');
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Bill.svc/rest/BillList',
          request_param,
          {}
        ).then(result => {
          console.log(result);
          if (result.data.charAt != '{') {
            result.data = result.data.substr(1);
          }
          resolve(JSON.parse(result.data));
        }, error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        this.httpclient.post(
          this.config.apiEndpointWeb + 'Bill.svc/rest/BillList',
          JSON.stringify(request_param)
        ).subscribe(result => {
          console.log(result);
          resolve(result);
        }, error => {
          console.log(error);
          reject(error.error);
        });
      }
    })
    // return this.httpclient.post(
    //   this.config.apiEndpointWeb + 'Bill.svc/rest/BillList',
    //   JSON.stringify(request_param))
    //   .pipe(
    //   );
  }

  getBillFile(billNumber) {
    let param = 'Bill.svc/rest/BillFile?SessionKey=' +
      encodeURIComponent(localStorage.getItem("sessionKey")) +
      "&ContactCode=" + JSON.parse(localStorage.getItem('currentUser')).username +
      "&BillNumber=" + billNumber + "&BillType=pdf";

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.nativeHTTP.setDataSerializer('json');
        this.nativeHTTP.get(
          this.config.apiEndpointMobile + param,
          {},
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
        this.httpclient.get<any>(
          this.config.apiEndpointWeb + param
        ).subscribe(result => {
          console.log(result);
          resolve(result);
        }, error => {
          console.log(error);
          reject(error.error);
        })
      }
    })


    // return this.httpclient.get(
    //   this.config.apiEndpointWeb +
    //   'Bill.svc/rest/BillFile?SessionKey=' +
    //   encodeURIComponent(localStorage.getItem("sessionKey")) +
    //   "&ContactCode=" + JSON.parse(localStorage.getItem('currentUser')).username +
    //   "&BillNumber=" + billNumber + "&BillType=pdf")
    //   .pipe(

    //   );
  }

  returnErrorState(error) {
    console.log(error.error.includes('he host could not be resolved'));
    if (error.error.charAt(0) != '{' && !error.error.includes('he host could not be resolved')) {
      console.log('why come here');
      error.error = error.error.substr(1);
      return (JSON.parse(error.error));
    } else {
      return (error.error);
    }
  }


}
