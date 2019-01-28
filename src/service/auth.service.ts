import { Injectable, Inject } from '@angular/core';
import { User, APP_CONFIG, IAppConfig } from '../model';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

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

  getLoggedUser(): User {
    if (localStorage.getItem("currentUser") != null) {
      return JSON.parse(localStorage.getItem("currentUser"));
    }
    return null;
  }

  createRandomSessionKey(): Observable<any> {

    return this.httpclient.post(this.config.apiEndpoint + 'Authentication.svc/rest/AuthenticateSimpleCreateSessionAndAuthenticateContact',
      JSON.stringify({
        PrivateKey: this.config.WebPrivateKey,
        DatabaseUserCode: this.config.DatabaseUserCode,
        DatabasePassword: this.config.DatabasePassword,
        UserCode: JSON.parse(localStorage.getItem('currentUser')).username,
        Password: JSON.parse(localStorage.getItem('currentUser')).password
      })).pipe(
      );
  }

  getAccountDetail() {
    return this.httpclient.get(this.config.apiEndpoint + 'Contact.svc/rest/Contact?SessionKey=' + encodeURIComponent(localStorage.getItem("sessionKey")) + '&ContactCode=' + JSON.parse(localStorage.getItem('currentUser')).username + '&LoadAddress=true&LoadContactPhones=true&LoadContactEmailAddresses=true&RefreshCache=true')
      .pipe(
      );
  }

  updateAddress(newAddress): Observable<any[]> {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
      "Address": {
        "Address1": newAddress,
        "AddressType": {
          "Code": "BA",
        },
        "Country": {
          "Code": "AU"
        },
        "PostCode": {
          "Code": "2609"
        },
        "State": {
          "Code": "NSW",
        },
        "Suburb": "TEST",
      }
    };
    console.log(JSON.stringify(param));
    return this.httpclient.put<any[]>(this.config.apiEndpoint + 'Address.svc/rest/AddressUpdateByContact', JSON.stringify(param))
      .pipe(
      );
  }

  updateEmail(emailAddress): Observable<any[]> {

    let param = {
      "SessionKey": (localStorage.getItem("sessionKey")),
      "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
      "EmailAddress": {
        "EmailAddress": emailAddress
      }
    }
    return this.httpclient.put<any[]>(
      this.config.apiEndpoint + 'Email.svc/rest/EmailAddressUpdate ',
      JSON.stringify(param))
      .pipe(
      );
  }

  updatePhone(phoneNumber): Observable<any[]> {
    let param =
    {
      "SessionKey": (localStorage.getItem("sessionKey")),
      "ContactPhone": {
        "AreaCode": 2,
        "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
        "ContactPhoneType": {
          "Code": "HP",
        },
        "Number": phoneNumber,
        "Reference": 3594,
      }
    }
    return this.httpclient.put<any[]>(
      this.config.apiEndpoint + 'ContactPhone.svc/rest/ContactPhoneUpdate',
      JSON.stringify(param))
      .pipe(
      );
  }

  updateName(userName) {

    return this.http.get(
      this.config.apiEndpoint +
      'Contact.svc/rest/BusinessNameUpdate?SessionKey=' +
      encodeURIComponent(localStorage.getItem("sessionKey")) +
      "&ContactCode=" + JSON.parse(localStorage.getItem('currentUser')).username +
      "&BusinessName=" + userName)
      .pipe(
      );
  }

}
