import { Component, OnInit } from '@angular/core';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { ModalController, NavController } from '@ionic/angular';
import { PaymentService } from 'src/service/payment.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/service/auth.service';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';

@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.page.html',
  styleUrls: ['./pay-now.page.scss'],
})
export class PayNowPage implements OnInit {

  animalControl = new FormControl('', [Validators.required]);

  public payData = { "name": "", "method": "", "cardnum": "", "exm": "none", "exy": new Date().getFullYear() };
  public cancenEnable: boolean;

  public payAmount: any;
  private totalAmount: any;
  private checked = false;
  private customCheck = false;


  customAmount = new FormControl('', [
    Validators.required
  ]);

  constructor(
    public translate: TranslateServiceService,
    public modalCtrl: ModalController,
    public paymentService: PaymentService,
    public navCtrl: NavController,
    private authService: AuthService,
    private loading: LoadingService,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    this.ionicInit();
    this.cancenEnable = false;
    this.payAmount = parseFloat(localStorage.getItem('paynowAmount'));
    this.totalAmount = parseFloat(localStorage.getItem('paynowAmount'));
  }

  ionicInit() {
    this.translate.translaterService();
  }

  goback() {
    // this.cancenEnable = true;
    this.navCtrl.pop();
  }

  // async paymentSubmit(paymentForm) {
  //   if (paymentForm.valid && !this.cancenEnable) {
  //     let profileModal = await this.modalCtrl.create({
  //       component: PayNowCheckPage
  //     });
  //     profileModal.onDidDismiss().then(data => {
  //       this.navCtrl.navigateForward('home');
  //     });
  //     await profileModal.present();
  //   }
  // }

  paymentSubmit(paymentForm) {
    if (paymentForm.valid && !this.cancenEnable && (!this.checked || this.checked && this.customAmount.valid) && this.payAmount <= this.totalAmount) {

      this.loading.present();

      if (this.payData.method == 'Paypal') {
        if (this.checked) {

        } else {
          this.payAmount = this.totalAmount;
        }
        this.paymentService.setAccountBalanceByDefault(parseFloat(this.payAmount)).then(result => {
          console.log(result);
          this.loading.dismiss();
          this.cancenEnable = true;
        }, error => {
          console.log(error);
          if (Object(error).Code.Name == 'InvalidSessionKeyException') {
            this.authService.createRandomSessionKey().then(result => {
              if (result) {
                console.log(result);
                this.paymentSubmit(paymentForm);
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
        this.paymentService.setAccountBalanceByCard(parseFloat(this.payAmount)).then(result => {
          console.log(result);
          this.loading.dismiss();
          this.cancenEnable = true;
        }, error => {
          console.log(error);
          if (Object(error).Code.Name == 'InvalidSessionKeyException') {
            this.authService.createRandomSessionKey().then(result => {
              if (result) {
                console.log(result);
                this.paymentSubmit(paymentForm);
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

  gotoPaymenthistory() {
    this.cancenEnable = false;
    this.navCtrl.navigateForward('home');
  }

  changeCheck() {
    console.log(this.checked);
    this.customCheck = this.checked;
  }

  submitPayment() {
    document.getElementById("trigersubmit").click();
  }


}
