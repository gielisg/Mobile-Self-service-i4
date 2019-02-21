import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { PaymentService } from 'src/service/payment.service';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.page.html',
  styleUrls: ['./payment-update.page.scss'],
})
export class PaymentUpdatePage implements OnInit {


  public payData = { "name": "", "paymentId": 0, "number": "", "exm": "1", "exy": new Date().getFullYear() };
  public expireMonth: any[];
  public expireYear: any[];

  public userId = "";

  selExm = new FormControl('', [Validators.required]);

  selExy = new FormControl('', [Validators.required]);

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
    public paymentService: PaymentService,
    public authService: AuthService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.expireMonth = new Array();
    this.expireYear = new Array();

    this.payData.paymentId = parseInt(localStorage.getItem('paymentID'));
    this.payData.number = localStorage.getItem('paymentCardNumber');

    console.log('ionViewDidLoad NewPaymentPage');
    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(i);
    }

    for (let i = new Date().getFullYear(); i < 2050; i++) {
      this.expireYear.push(i);
    }
    this.ionicInit();
  }

  goback() {
    // this.navCtrl.pop();
    this.modalCtrl.dismiss('');
  }

  paymentSubmit(comProfileForm) {
    if (comProfileForm.valid && this.selExm.valid) {

      let addParam = {
        "name": this.payData.name,
        "paymentId": this.payData.paymentId,
        "number": this.payData.number,
        "expireDate": this.payData.exy + "-" + this.setTwostring(this.payData.exm) + "-" + new Date().getDate() + "T00:00:00"
      };

      this.loading.present();
      this.paymentService.accountPaymentMethodUpdate(addParam).then(data => {
        console.log(data);
        this.loading.dismiss();
        this.modalCtrl.dismiss({ name: this.payData.name, expireDate: addParam.expireDate });
      }, error => {
        console.log(error);
        if (Object(error).Code.Name == 'InvalidSessionKeyException') {
          this.authService.createRandomSessionKey().then(result => {
            if (result) {
              console.log(result);
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

  submitAddPayment() {
    console.log('Trigger Option');
    document.getElementById("trigersubmit").click()
  }

  ionicInit() {

    this.translate.translaterService();

    this.userId = JSON.parse(localStorage.getItem('currentUser')).username;

    this.payData.exm = (new Date().getMonth() + 1).toString();
  }

  setTwostring(inputVal) {
    if (parseInt(inputVal) < 10) {
      return "0" + inputVal;
    } else {
      return inputVal;
    }
  }

}
