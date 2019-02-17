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


  public payData = { "name": "", "method": "", "cardnum": "", "exm": "1", "exy": "2018" };
  public expireMonth: any[];
  public expireYear: any[];

  public userId = "";

  selType = new FormControl('', [Validators.required]);

  selExm = new FormControl('', [Validators.required]);

  selExy = new FormControl('', [Validators.required]);

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
    public paymentService: PaymentService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.expireMonth = new Array();
    this.expireYear = new Array();
    console.log('ionViewDidLoad NewPaymentPage');
    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(i);
    }

    for (let i = 2018; i < 2050; i++) {
      this.expireYear.push(i);
    }
    this.ionicInit();
  }

  goback() {
    this.navCtrl.pop();
  }

  paymentSubmit(comProfileForm) {
    if (comProfileForm.valid && this.selType.valid && this.selExm.valid) {

      let add_param = {
        "name": this.payData.name,
        "number": this.payData.cardnum,
        "expireDate": this.payData.exy + "-" + this.setTwostring(this.payData.exm) + "-" + new Date().getDate() + "T00:00:00"
      };

      this.loading.present();
      this.paymentService.accountPaymentMethodAdd(add_param).then(data => {
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
  }

  ionicInit() {

    this.translate.translaterService();

    this.userId = JSON.parse(localStorage.getItem('currentUser')).username;

    this.payData.exm = (new Date().getMonth() + 1).toString();
  }

  setTwostring(input_val) {
    if (parseInt(input_val) < 10) {
      return "0" + input_val;
    } else {
      return input_val;
    }
  }

}
