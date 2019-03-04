import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  private passData = { "password": "", "confirmPass": "", "accountNumber": "" };
  private submitState = false;

  private confirmPassword = new FormControl('', [
    Validators.required,
  ]);

  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateServiceService,

  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  ionicInit() {
    this.translate.translaterService();
  }

  goback() {
    this.modalCtrl.dismiss("");
  }

  forgotSubmit(forgotPasswordData) {
    this.submitState = true;
    console.log(forgotPasswordData);
    if (forgotPasswordData.valid && this.passData.password == this.passData.confirmPass
      && this.confirmPassword.valid) {
      this.modalCtrl.dismiss({ state: "success" });
    }
  }

  submitAddPayment() {
    document.getElementById("trigersubmit").click()
  }

}
