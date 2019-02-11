import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public startDate: any;

  constructor(
    @Inject(APP_CONFIG) public config: IAppConfig,
    public http: Http,
    public httpclient: HttpClient,
  ) {
    console.log('Hello PaymentProvider Provider');
    if (new Date().toISOString().includes(".")) {
      this.startDate = new Date().toISOString().split(".")[0];
    } else {
      this.startDate = new Date().toISOString();
    }
    console.log( this.startDate);

    // let tempDate = this.startDate;
    // this.startDate = tempDate.split("T")[0].split("-")[0] + "-" + tempDate.split("T")[0].split("-")[1] + "-" + (parseInt(tempDate.split("T")[0].split("-")[2]) + 1).toString();
    // this.startDate = this.startDate + "T" + "00:00:00";
  }

  getPaymentAvailList() {
    let encodedSessionKey = encodeURIComponent(localStorage.getItem("sessionKey"));
    return this.httpclient.get(
      this.config.apiEndpoint +
      'Payment.svc/rest/AccountPaymentMethodListValid?SessionKey=' +
      encodedSessionKey + "&ContactCode=" +
      JSON.parse(localStorage.getItem('currentUser')).username)
      .pipe(
      );
  }
  accountPaymentMethod(paymentId) {
    let encodedSessionKey = encodeURIComponent(localStorage.getItem("sessionKey"));
    return this.httpclient.get(
      this.config.apiEndpoint +
      'Payment.svc/rest/AccountPaymentMethod?SessionKey=' +
      encodedSessionKey + "&Id=" + paymentId +
      "&ContactCode=" + JSON.parse(localStorage.getItem('currentUser')).username)
      .pipe(
      );
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
          "Code": "MC",
          "Type": {
            "Code": "C",
          }
        },
        "StartDate": this.startDate,
        "SubscriberOwns": true,
        "Source": "",
        "CreateOption": "NewOnly",
      }
    };
    return this.httpclient.post(
      this.config.apiEndpoint + 'Payment.svc/rest/AccountPaymentMethodAdd',
      JSON.stringify(param))
      .pipe(
      );
  }

  accountPaymentMethodCancel(paymentId) {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "Id": parseInt(paymentId),
      "StartDate": this.startDate,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      })
    };

    return this.httpclient.put(
      this.config.apiEndpoint + 'Payment.svc/rest/AccountPaymentMethodCancel',
      JSON.stringify(param), httpOptions)
      .pipe(
      );
  }

  accountPaymentMethodMakeDefault(paymentId) {
    let param = {
      "SessionKey": localStorage.getItem("sessionKey"),
      "Id": parseInt(paymentId),
      "StartDate": this.startDate,
      "StatusCode": "O"
    };
    return this.httpclient.put(
      this.config.apiEndpoint + 'Payment.svc/rest/AccountPaymentMethodMakeDefault',
      JSON.stringify(param))
      .pipe(
      );
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
    return this.httpclient.put(
      this.config.apiEndpoint + 'Payment.svc/rest/AccountPaymentMethodUpdate',
      JSON.stringify(param))
      .pipe(
      );
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
    return this.httpclient.post(
      this.config.apiEndpoint + 'Payment.svc/rest/PaymentRequestCreate',
      JSON.stringify(param))
      .pipe(
      );
  }

  paymentMethodFromAccountNumberAndType() {
    let encodedSessionKey = encodeURIComponent(localStorage.getItem("sessionKey"));
    return this.httpclient.get(
      this.config.apiEndpoint +
      'Payment.svc/rest/PaymentMethodFromAccountNumberAndType?SessionKey=' +
      encodedSessionKey + "&ContactCode=" +
      JSON.parse(localStorage.getItem('currentUser')).username +
      "&PaymentMethodTypeCode=C")
      .pipe(
      );
  }
}
