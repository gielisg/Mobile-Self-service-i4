import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { ToastService } from 'src/service/toast.service';
import { LoadingService } from 'src/service/loading.service';
import { AuthService } from 'src/service/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { PaymentService } from 'src/service/payment.service';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.page.html',
  styleUrls: ['./account-balance.page.scss'],
})
export class AccountBalancePage implements OnInit {

  public expireMonth: any[];
  public expireYear: any[];

  private methodState = true;
  private cardState = false;
  private defaultState = false;



  selType = new FormControl('', [Validators.required]);
  selExm = new FormControl('', [Validators.required]);
  selExy = new FormControl('', [Validators.required]);

  private balanceData = {
    'method': '',
    'amount': 25.689,
    'cardNum': '',
    'name': '',
    'exm': '',
    'exy': '',
    'expireDate': ''
    // 'exm': new Date().getMonth() + 1,
    // 'exy': new Date().getFullYear()
  };

  constructor(
    private navCtrl: NavController,
    private translate: TranslateServiceService,
    private toast: ToastService,
    private loading: LoadingService,
    private paymentService: PaymentService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.ionicInit();
    this.selectMethod();
  }

  ionicInit() {
    this.translate.translaterService();

    this.expireMonth = new Array();
    this.expireYear = new Array();
    console.log('ionViewDidLoad AccountBalancePage');
    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(i);
    }

    for (let i = new Date().getFullYear(); i < 2050; i++) {
      this.expireYear.push(i);
    }

    console.log(this.balanceData);
  }

  balanceSubmit(balanceForm) {
    console.log(balanceForm);
    if (balanceForm.valid) {
      this.balanceData.expireDate =
        this.balanceData.exy + "-" +
        this.setTwostring(this.balanceData.exm) + "-" +
        new Date().getDate() + "T00:00:00";
      this.loading.present();
      if (this.balanceData.method == 'Paypal') {
        this.paymentService.setAccountBalanceByDefault(this.balanceData.amount).then(result => {
          console.log(result);
          this.loading.dismiss();
          this.navCtrl.pop();
        }, error => {
          console.log(error);
          if (Object(error).Code.Name == 'InvalidSessionKeyException') {
            this.authService.createRandomSessionKey().then(result => {
              if (result) {
                console.log(result);
                this.balanceSubmit(balanceForm);
              }
            }, error => {
              console.log(error);
            });
          } else {
            this.toast.present(Object(error).Message);
          }

          this.loading.dismiss();
        });
      } else {
        this.paymentService.setAccountBalanceByCard(this.balanceData).then(result => {
          console.log(result);
          this.loading.dismiss();
          this.navCtrl.pop();
        }, error => {
          console.log(error);
          if (Object(error).Code.Name == 'InvalidSessionKeyException') {
            this.authService.createRandomSessionKey().then(result => {
              if (result) {
                console.log(result);
                this.balanceSubmit(balanceForm);
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
    }
  }

  setTwostring(inputVal) {
    if (parseInt(inputVal) < 10) {
      return "0" + inputVal;
    } else {
      return inputVal;
    }
  }

  setMonthList() {
    console.log(this.balanceData.exy);
    if (this.balanceData.exy == (new Date().getFullYear()).toString()) {
      if (parseInt(this.balanceData.exm) < new Date().getMonth() + 1) {
        this.balanceData.exm = '';
      }
      this.expireMonth = new Array();
      for (let i = new Date().getMonth() + 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    } else {
      this.expireMonth = new Array();
      for (let i = 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    }
    console.log(this.expireMonth);
  }

  selectMethod() {
    console.log(this.balanceData.method);
    if (this.balanceData.method == "Paypal") {
      this.defaultState = true;
      this.cardState = false;
    } else if (this.balanceData.method == 'Visa') {
      this.defaultState = false;
      this.cardState = true;
    } else {
      this.cardState = false;
      this.defaultState = false;
    }
  }

  goback() {
    this.navCtrl.pop();
  }

}
