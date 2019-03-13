import { Injectable, Inject } from '@angular/core';
import { User, APP_CONFIG, IAppConfig } from '../model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';

@Injectable()
export class AuthService {

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public http: Http,
    public httpclient: HttpClient,
    private platform: Platform,
    private nativeHTTP: HTTP,
  ) {
    console.log('Hello AuthserviceProvider Provider');
  }

  login(username, password) {

    let params = {
      PrivateKey: this.config.WebPrivateKey,
      DatabaseUserCode: this.config.DatabaseUserCode,
      DatabasePassword: this.config.DatabasePassword,
      UserCode: username,
      Password: password
    };

    console.log(params);

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        console.log('mobile');
        this.nativeHTTP.setDataSerializer('json');
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Authentication.svc/rest/AuthenticateSimpleCreateSessionAndAuthenticateContact',
          (params),
          {
          },
        ).then(result => {
          console.log(result.data);
          console.log(result.data.charAt(0));
          if (result.data.charAt(0) != '{') {
            result.data = result.data.substr(1);
          }
          console.log(JSON.parse(result.data));
          localStorage.setItem('sessionKey', JSON.parse(result.data));
          resolve(JSON.parse(result.data));
        }).catch(error => {
          console.log(error);
          if (error.error.charAt(0) != '{') {
            error.error = error.error.substr(1);
          }
          reject(JSON.parse(error.error));
        });
      } else {
        console.log('web');
        this.httpclient.post<any>(
          this.config.apiEndpointWeb + 'Authentication.svc/rest/AuthenticateSimpleCreateSessionAndAuthenticateContact',
          JSON.stringify(params)
        ).subscribe(result => {
          console.log(result);
          localStorage.setItem('sessionKey', result);
          resolve(result);
        }, error => {
          reject(error.error);
        })
      }
    });


    // return this.httpclient.post(this.config.apiEndpoint + 'Authentication.svc/rest/AuthenticateSimpleCreateSessionAndAuthenticateContact', JSON.stringify({
    //   PrivateKey: this.config.WebPrivateKey, DatabaseUserCode: this.config.DatabaseUserCode, DatabasePassword: this.config.DatabasePassword,
    //   UserCode: username, Password: password
    // })).pipe(
    // );
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

  createRandomSessionKey() {

    let params = {
      PrivateKey: this.config.WebPrivateKey,
      DatabaseUserCode: this.config.DatabaseUserCode,
      DatabasePassword: this.config.DatabasePassword,
      UserCode: JSON.parse(localStorage.getItem('currentUser')).username,
      Password: JSON.parse(localStorage.getItem('currentUser')).password
    };

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        console.log('mobile');
        this.nativeHTTP.setDataSerializer('json');
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Authentication.svc/rest/AuthenticateSimpleCreateSessionAndAuthenticateContact',
          // {userData},
          params,
          // (request_param),
          {
          },
        ).then(result => {
          console.log(result.data);
          if (result.data.charAt(0) != '{') {
            result.data = result.data.substr(1);
          }
          localStorage.setItem('sessionKey', JSON.parse(result.data));
          resolve(JSON.parse(result.data));
        }).catch(error => {
          console.log(error);
          if (error.error.charAt(0) != '{') {
            error.error = error.error.substr(1);
          }
          reject(JSON.parse(error.error));
        });
      } else {
        console.log('web');
        this.httpclient.post<any>(
          this.config.apiEndpointWeb + 'Authentication.svc/rest/AuthenticateSimpleCreateSessionAndAuthenticateContact',
          JSON.stringify(params)
        ).subscribe(result => {
          console.log(result);
          localStorage.setItem('sessionKey', result);
          resolve(result);
        }, error => {
          reject(error.error);
        })
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

  getAccountDetail() {

    let sendParam = 'Contact.svc/rest/Contact?SessionKey=' + encodeURIComponent(localStorage.getItem("sessionKey")) +
      '&ContactCode=' + JSON.parse(localStorage.getItem('currentUser')).username +
      '&LoadAddress=true&LoadContactPhones=true&LoadContactEmailAddresses=true&RefreshCache=true';
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.get(
          this.config.apiEndpointMobile + sendParam,
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
        console.log('web');
        console.log(this.config.apiEndpointWeb + sendParam);
        this.httpclient.get<any>(this.config.apiEndpointWeb + sendParam)
          .subscribe(result => {
            resolve(result);
          }, error => {
            reject(error.error);
          })
      }
    })

  }

  updateAddress(newAddress) {
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
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.put(
          this.config.apiEndpointMobile + 'Address.svc/rest/AddressUpdateByContact',
          (param),
          {}
        ).then(result => {
          console.log(result);
          // if (result.data.charAt(0) != '{') {
          //   result.data = result.data.substr(1);
          // }
          resolve(result.data);
        }, error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        this.httpclient.put<any>(
          this.config.apiEndpointWeb + 'Address.svc/rest/AddressUpdateByContact',
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
    // return this.httpclient.put<any[]>(this.config.apiEndpointWeb + 'Address.svc/rest/AddressUpdateByContact', JSON.stringify(param))
    //   .pipe(
    //   );
  }

  updateEmail(emailAddress) {

    let param = {
      "SessionKey": (localStorage.getItem("sessionKey")),
      "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
      "EmailAddress": {
        "EmailAddress": emailAddress
      }
    }
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.put(
          this.config.apiEndpointMobile + 'Email.svc/rest/EmailAddressUpdate',
          (param),
          {}
        ).then(result => {
          console.log(result);
          // if (result.data.charAt(0) != '{') {
          //   result.data = result.data.substr(1);
          // }
          resolve(result.data);
        }, error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        this.httpclient.put<any>(
          this.config.apiEndpointWeb + 'Email.svc/rest/EmailAddressUpdate',
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
    // return this.httpclient.put<any[]>(
    //   this.config.apiEndpointWeb + 'Email.svc/rest/EmailAddressUpdate ',
    //   JSON.stringify(param))
    //   .pipe(
    //   );
  }

  updatePhone(phoneNumber) {
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

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.put(
          this.config.apiEndpointMobile + 'ContactPhone.svc/rest/ContactPhoneUpdate',
          (param),
          {}
        ).then(result => {
          console.log(result);
          // if (result.data.charAt(0) != '{') {
          //   result.data = result.data.substr(1);
          // }
          resolve(result.data);
        }, error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        this.httpclient.put<any>(
          this.config.apiEndpointWeb + 'ContactPhone.svc/rest/ContactPhoneUpdate',
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
    // return this.httpclient.put<any[]>(
    //   this.config.apiEndpointWeb + 'ContactPhone.svc/rest/ContactPhoneUpdate',
    //   JSON.stringify(param))
    //   .pipe(
    //   );
  }

  updateName(userName) {

    let param = 'Contact.svc/rest/BusinessNameUpdate?SessionKey=' +
      encodeURIComponent(localStorage.getItem("sessionKey")) +
      "&ContactCode=" + JSON.parse(localStorage.getItem('currentUser')).username +
      "&BusinessName=" + userName;

    // return this.http.get(
    //   this.config.apiEndpointWeb +
    //   'Contact.svc/rest/BusinessNameUpdate?SessionKey=' +
    //   encodeURIComponent(localStorage.getItem("sessionKey")) +
    //   "&ContactCode=" + JSON.parse(localStorage.getItem('currentUser')).username +
    //   "&BusinessName=" + userName)
    //   .pipe(
    //   );


    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.get(
          this.config.apiEndpointMobile + param,
          {},
          {}
        ).then(result => {
          console.log(result);
          // if (result.data.charAt(0) != '{') {
          //   result.data = result.data.substr(1);
          // }
          resolve(result.data);
        }, error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        this.httpclient.get<any>(
          this.config.apiEndpointWeb + param,
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

}
