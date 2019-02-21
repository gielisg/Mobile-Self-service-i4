import { Component, OnInit } from '@angular/core';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { ModalController, NavController } from '@ionic/angular';
import { PaymentService } from 'src/service/payment.service';
import { FormControl, Validators } from '@angular/forms';

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

  constructor(
    public translate: TranslateServiceService,
    public modalCtrl: ModalController,
    public paymentService: PaymentService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.ionicInit();
    this.cancenEnable = false;
    this.payAmount = localStorage.getItem('paynowAmount');
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
    if (paymentForm.valid && !this.cancenEnable) {
      this.cancenEnable = true;
    }
  }

  gotoPaymenthistory() {
    this.cancenEnable = false;
    this.navCtrl.navigateForward('home');
  }


}
