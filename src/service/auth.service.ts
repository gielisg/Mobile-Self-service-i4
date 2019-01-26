import { Injectable, Inject } from '@angular/core';
import { User, APP_CONFIG, IAppConfig } from '../model';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  public url_header = "https://ua.selcomm.com/SelcommWS/1.0267/";

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public http: Http,
    public httpclient: HttpClient,
  ) {
    console.log('Hello AuthserviceProvider Provider');
  }

  login(username, password): Observable<any> {

    return this.httpclient.post(this.config.apiEndpoint + 'Authentication.svc/rest/AuthenticateSimpleCreateSessionAndAuthenticateContact', JSON.stringify({
      PrivateKey: this.config.WebPrivateKey, DatabaseUserCode: this.config.DatabaseUserCode, DatabasePassword: this.config.DatabasePassword,
      UserCode: username, Password: password
    }))
      .pipe(
      );
  }

  fillLoggedUser(username, password, token) {
    var user: User = {
      id: 0,
      username: username,
      password: password,
      sessionKey: token
    };
    localStorage.setItem('sessionKey', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.config.Usercode = username;
    this.config.Password = password;
  }
}
