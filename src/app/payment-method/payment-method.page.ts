import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { AuthService } from 'src/service/auth.service';
import { PaymentService } from 'src/service/payment.service';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { PaymentUpdatePage } from '../payment-update/payment-update.page';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {

  public detailData = [];
  public accountNumber = "";
  public openText: any;
  public cancelText: any;
  public openNewPayment: any;

  constructor(
    public loading: LoadingService,
    public toast: ToastService,
    public authService: AuthService,
    public paymentService: PaymentService,
    public modalCtrl: ModalController,
    public translate: TranslateServiceService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,

  ) {
  }

  ngOnInit() {
    this.ionicInit();
  }

  goback() {
    this.navCtrl.pop();
  }

  async gotoNewPayment() {
    let alert = await this.alertCtrl.create({
      message: this.openNewPayment,
      buttons: [
        {
          text: this.openText,
          handler: data => {
            this.navCtrl.navigateForward('new-payment');
          }
        },
        {
          text: this.cancelText,
          role: 'cancel',
          handler: data => {
          }
        }
      ]
    });
    await alert.present();
  }

  ionicInit() {

    this.translate.translaterService();
    this.translate.convertText('open').subscribe(result => {
      this.openText = result;
    });
    this.translate.convertText('close').subscribe(result => {
      this.cancelText = result;
    });

    this.translate.convertText('open_new_payment').subscribe(result => {
      this.openNewPayment = result;
    });

    this.accountNumber = JSON.parse(localStorage.getItem('currentUser')).username;

    this.loading.present();

    this.paymentService.getPaymentAvailList().then(data => {
      console.log(data);
      for (let list of Object(data)) {
        let arraySam = { "name": "", "type": "", "number": "", "expiry": "", "status": "open", "paymentId": 0 };
        arraySam.paymentId = list.Id;
        arraySam.name = list.AccountName;
        arraySam.number = list.AccountNumber;
        arraySam.type = list.PaymentMethod.Type.Description;
        if (list.ExpiryDate != null) {
          arraySam.expiry = this.getExpiryDate(list.ExpiryDate);
        }
        arraySam.status = list.Status.Description.replace(/ /g, '');
        this.detailData.push(arraySam);
      }
      this.loading.dismiss();

    }, error => {
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        this.authService.createRandomSessionKey().then(result => {
          if (result) {
            console.log(result);
            // localStorage.setItem('sessionKey', result);
            this.ionicInit();
          }
        }, error => {
          console.log(error);
        });
      }
      this.loading.dismiss();
    });
  }

  deleteItem(index) {

    this.loading.present();

    this.paymentService.accountPaymentMethodCancel(this.detailData[index].paymentId).then(data => {
      this.detailData.splice(index, 1);
      this.loading.dismiss();
    }, error => {
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        this.authService.createRandomSessionKey().then(result => {
          if (result) {
            console.log(result);
            // localStorage.setItem('sessionKey', result);
            this.deleteItem(index);
          }
        }, error => {
          console.log(error);
        });
      }
      this.loading.dismiss();
    });
  }

  getExpiryDate(inputVal) {
    let arraySam1 = inputVal.split("T")[0];
    let arraySam2 = arraySam1.split("-");
    let returnVal = arraySam2[1] + "/" + arraySam2[0].substr(2);
    return returnVal;
  }

  async viewAndUpdate(paymentID, cardNum, paymentName) {
    console.log(paymentID);
    localStorage.setItem('paymentID', paymentID);
    localStorage.setItem('paymentCardNumber', cardNum);
    localStorage.setItem('paymentUserName', paymentName);
    let updatePayment = await this.modalCtrl.create({
      component: PaymentUpdatePage
    });
    updatePayment.onDidDismiss().then(result => {
      console.log(result.data);
      if (result.data != null && typeof (result.data) != "undefined" && result.data != '') {
        for (let list of this.detailData) {
          if (list.paymentId == paymentID) {
            list.name = result.data.name;
            list.expiry = this.getExpiryDate(result.data.expireDate);
          }
        }
      } else {
        console.log('didn\'t change any part of them');
      }
    });
    await updatePayment.present();
  }

}
