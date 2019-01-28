import { Injectable, Inject } from '@angular/core';
import { User, APP_CONFIG, IAppConfig } from '../model';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public http: Http,
    public httpclient: HttpClient,
  ) {

  }

  getBill(): Observable<any> {
    let request_param = {
      'SessionKey': (localStorage.getItem('sessionKey')),
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
    return this.httpclient.post(
      this.config.apiEndpoint + 'Bill.svc/rest/BillList',
      JSON.stringify(request_param)
    ).pipe(
    );
  }
}
