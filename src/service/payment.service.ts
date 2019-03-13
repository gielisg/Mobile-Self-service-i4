import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public startDate: any;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public http: Http,
    public httpclient: HttpClient,
    private platform: Platform,
    private nativeHTTP: HTTP,
  ) {
    console.log('Hello PaymentProvider Provider');
    if (new Date().toISOString().includes(".")) {
      this.startDate = new Date().toISOString().split(".")[0];
    } else {
      this.startDate = new Date().toISOString();
    }
    // this.startDate = new Date().toISOString().split('T')[0] + 'T00:00:00';
    console.log(this.startDate);
  }

  getPaymentAvailList() {
    let encodedSessionKey = encodeURIComponent(localStorage.getItem("sessionKey"));
    let param = 'Payment.svc/rest/AccountPaymentMethodListValid?SessionKey=' +
      encodedSessionKey + "&ContactCode=" +
      JSON.parse(localStorage.getItem('currentUser')).username;

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
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
          this.config.apiEndpointWeb + param,
        ).subscribe(result => {
          console.log(result);
          resolve(result);
        }, error => {
          console.log(error);
          reject(error.error);
        });
      }
    })
  }

  accountPaymentMethod(paymentId) {
    let encodedSessionKey = encodeURIComponent(localStorage.getItem("sessionKey"));
    let param = 'Payment.svc/rest/AccountPaymentMethod?SessionKey=' +
      encodedSessionKey + "&Id=" + paymentId +
      "&ContactCode=" + JSON.parse(localStorage.getItem('currentUser')).username;

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
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

  accountPaymentMethodAdd(accountMethod) {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
      "AccountPaymentMethod": {
        "AccountName": accountMethod.name,
        "AccountNumber": accountMethod.number,
        "ExpiryDate": accountMethod.expireDate,
        "PaymentMethod": {
          "Code": accountMethod.cardType,
          "Type": {
            "Code": accountMethod.cardCodeType,
          }
        },
        "StartDate": this.startDate,
        "SubscriberOwns": true,
        "Source": "3",
        "CreateOption": "AlwaysCreate",
        "Default": "true",
      }
    };
    console.log(param);
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Payment.svc/rest/AccountPaymentMethodAdd',
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
          this.config.apiEndpointWeb + 'Payment.svc/rest/AccountPaymentMethodAdd',
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

  accountPaymentMethodCancel(paymentId) {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "Id": parseInt(paymentId),
      // "StartDate": this.startDate,
      "Note": 'AccooutPaymentMethodCancel Test',
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    };

    console.log(param);

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.put(
          this.config.apiEndpointMobile + 'Payment.svc/rest/AccountPaymentMethodCancel',
          param,
          {}
        ).then(result => {
          console.log(result);
          if (result.data == "") {
            resolve(result.data);
          } else {
            if (result.data.charAt(0) != '{') {
              result.data = result.data.substr(1);
            }
            resolve(JSON.parse(result.data));
          }
        }, error => {
          console.log(error);
          reject(this.returnErrorState(error));
        });
      } else {
        this.httpclient.put<any>(
          this.config.apiEndpointWeb + 'Payment.svc/rest/AccountPaymentMethodCancel',
          JSON.stringify(param),
          httpOptions
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

  accountPaymentMethodDefault() {
    let sendParam = 'Payment.svc/rest/AccountPaymentMethodDefault?SessionKey=' + encodeURIComponent(localStorage.getItem("sessionKey")) +
      '&ContactCode=' + JSON.parse(localStorage.getItem('currentUser')).username;
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
    });
  }

  accountPaymentMethodMakeDefault(paymentId) {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "Id": parseInt(paymentId),
      "StartDate": this.startDate,
      "StatusCode": "O"
    };

    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.put(
          this.config.apiEndpointMobile + 'Payment.svc/rest/AccountPaymentMethodMakeDefault',
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
        this.httpclient.put<any>(
          this.config.apiEndpointWeb + 'Payment.svc/rest/AccountPaymentMethodMakeDefault',
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


  setAccountBalanceByCard(balanceData) {

    let sendParam = 'Payment.svc/rest/PaymentRequestSimpleByCreditCard?SessionKey=' + encodeURIComponent(localStorage.getItem("sessionKey")) +
      '&ContactCode=' + JSON.parse(localStorage.getItem('currentUser')).username +
      '&CardNumber=' + balanceData.cardNum + '&CardName=' + balanceData.name + '&ExpiryDate=' + balanceData.expireDate + '&Amount=' + balanceData.amount;
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
    });
  }

  setAccountBalanceByDefault(amount) {

    // let amountParam = {
    //   "SessionKey": (localStorage.getItem("sessionKey")),
    //   "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
    //   "Amount": amount,
    // }

    let sendParam = 'Payment.svc/rest/PaymentRequestSimpleByDefaultPaymentMethod?SessionKey=' + encodeURIComponent(localStorage.getItem("sessionKey")) +
      '&ContactCode=' + JSON.parse(localStorage.getItem('currentUser')).username +
      '&Amount=' + amount;

    // let sendParam = 'Payment.svc/rest/PaymentRequestSimpleByDefaultPaymentMethod?' + JSON.stringify(amountParam);

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
    });
  }

  accountPaymentMethodUpdate(accountMethod) {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "AccountPaymentMethod": {
        "AccountName": accountMethod.name,
        "AccountNumber": accountMethod.number,
        "ExpiryDate": accountMethod.expireDate,
        "Exported": false,
        "Id": accountMethod.paymentId,
        "PaymentMethod": {
          "Code": "MC",
        },
        "StartDate": this.startDate,
        "SubscriberOwns": true,
      }
    };
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.put(
          this.config.apiEndpointMobile + 'Payment.svc/rest/AccountPaymentMethodUpdate',
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
        this.httpclient.put<any>(
          this.config.apiEndpointWeb + 'Payment.svc/rest/AccountPaymentMethodUpdate',
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

  paymentRequestCreate(paymentRequest) {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "PaymentRequest": {
        "AccountPaymentMethod": {
          "Id": paymentRequest.paymentId,
        },
        "ContactCode": JSON.parse(localStorage.getItem('currentUser')).username,
        "FinancialTransaction": {
          "Source": {
            "Code": "PT"
          }
        },
        "RequestAmount": paymentRequest.amount,
        "PaymentSource": {
          "Id": 3
        },
        "SendEmail": false,
      }
    };
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
        this.nativeHTTP.post(
          this.config.apiEndpointMobile + 'Payment.svc/rest/PaymentRequestCreate',
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
          this.config.apiEndpointWeb + 'Payment.svc/rest/PaymentRequestCreate',
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

  paymentMethodFromAccountNumberAndType() {
    let encodedSessionKey = encodeURIComponent(localStorage.getItem("sessionKey"));
    let param = 'Payment.svc/rest/PaymentMethodFromAccountNumberAndType?SessionKey=' +
      encodedSessionKey + "&ContactCode=" +
      JSON.parse(localStorage.getItem('currentUser')).username +
      "&PaymentMethodTypeCode=C";


    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
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
        });
      }
    });
  }

  paymentSurcharge(paymentMethodCode) {
    let encodedSessionKey = encodeURIComponent(localStorage.getItem("sessionKey"));
    let param = 'Payment.svc /rest/PaymentSurcharge?SessionKey=' +
      encodedSessionKey + "&PaymentMethodCode=" + paymentMethodCode  + "&PaymentSource=" + "3" + "&ContactCode=" +
      JSON.parse(localStorage.getItem('currentUser')).username +
      "&RefreshCache=true";


    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova') && (this.platform.is("android") || this.platform.is("ios"))) {
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
