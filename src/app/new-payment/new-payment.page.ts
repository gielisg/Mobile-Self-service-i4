import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { PaymentService } from 'src/service/payment.service';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.page.html',
  styleUrls: ['./new-payment.page.scss'],
})
export class NewPaymentPage implements OnInit {


  public payData = { "name": "", "method": "", "cardnum": "", "exm": "", "exy": '' };
  public expireMonth: any[];
  public expireYear: any[];

  private defaultState = true;

  public userId = "";

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
    public paymentService: PaymentService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.ionicInit();
    this.selectMethod();
  }

  goback() {
    this.navCtrl.pop();
  }

  paymentSubmit(comProfileForm) {
    if (comProfileForm.valid) {
      this.loading.present();
      // if (this.payData.method == "Paypal") {
      //   this.paymentService.accountPaymentMethodDefault().then(result => {
      //     console.log(result);
      //     this.loading.dismiss();
      //     this.navCtrl.navigateRoot('my-account');
      //   }, error => {
      //     console.log(error);
      //     if (Object(error).Code.Name == 'InvalidSessionKeyException') {
      //       this.authService.createRandomSessionKey().then(result => {
      //         if (result) {
      //           console.log(result);
      //           // localStorage.setItem('sessionKey', Object(result));
      //           this.paymentSubmit(comProfileForm);
      //         }
      //       }, error => {
      //         console.log(error);
      //       });
      //     } else {
      //       this.toast.present(Object(error).Message);
      //     }
      //     this.loading.dismiss();
      //   });
      // } else {
      let addParam = {
        "name": this.payData.name,
        "cardType": '',
        "cardCodeType": '',
        "number": this.payData.cardnum,
        "expireDate": this.payData.exy + "-" + this.setTwostring(this.payData.exm) + "-" + new Date().getDate() + "T00:00:00"
      };
      if (this.payData.method == 'credit') {
        addParam.cardType = 'CC';
        addParam.cardCodeType = 'C';
      } else if (this.payData.method == 'debit') {
        addParam.cardType = 'DD';
        addParam.cardCodeType = 'D';
      } else {
        addParam.cardType = 'MC';
        addParam.cardCodeType = 'C';
      }
      this.paymentService.accountPaymentMethodAdd(addParam).then(data => {
        console.log(data);
        this.loading.dismiss();
        // this.navCtrl.push(PaymentMethodPage);
        this.navCtrl.navigateRoot('my-account');
      }, error => {
        console.log(error);
        if (Object(error).Code.Name == 'InvalidSessionKeyException') {
          this.authService.createRandomSessionKey().then(result => {
            if (result) {
              console.log(result);
              // localStorage.setItem('sessionKey', Object(result));
              this.paymentSubmit(comProfileForm);
            }
          }, error => {
            console.log(error);
          });
        } else {
          this.toast.present(Object(error).Message);
        }

        this.loading.dismiss();
      });
    }
    // }
  }

  submitAddPayment() {
    document.getElementById("trigersubmit").click();
  }

  ionicInit() {

    this.translate.translaterService();

    this.expireMonth = new Array();
    this.expireYear = new Array();
    console.log('ionViewDidLoad NewPaymentPage');
    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(i);
    }

    for (let i = new Date().getFullYear(); i < 2050; i++) {
      this.expireYear.push(i);
    }
    this.userId = JSON.parse(localStorage.getItem('currentUser')).username;
  }

  setTwostring(inputVal) {
    if (parseInt(inputVal) < 10) {
      return "0" + inputVal;
    } else {
      return inputVal;
    }
  }

  selectMethod() {
    this.defaultState = false;
    // if (this.payData.method == "Paypal") {
    //   this.defaultState = true;
    // } else if (this.payData.method == "Visa") {
    //   this.defaultState = false;
    // } else {
    //   this.defaultState = true;
    // }
  }

  selectExpireYear() {
    if (parseInt(this.payData.exy) == new Date().getFullYear()) {
      if (parseInt(this.payData.exm) == new Date().getMonth() + 1) {
        this.payData.exm = '';
      }
      this.expireMonth = new Array();
      for (let i = new Date().getMonth() + 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    } else {
      this.expireMonth = new Array();
      for (let i = new Date().getMonth() + 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    }
  }

}
