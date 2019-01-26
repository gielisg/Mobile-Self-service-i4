import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { NavController, MenuController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public userData = { "username": "", "password": "", "email": "", "phone": "", "address": "", "status": "" };

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);
  phoneFormControl = new FormControl('', [
    Validators.required
  ]);

  public send_data: any[];

  constructor(
    public translate: TranslateServiceService,
    public navCtrl: NavController,
    public menu: MenuController,
    public loading: LoadingService,
    public toast: ToastService,
    public authservice: AuthService,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  ionicInit() {
    this.menu.enable(false, 'first');
    this.translate.translaterService();
  }

  signUpSubmit(signUpData) {
    if (signUpData.valid && this.emailFormControl.valid) {
      localStorage.setItem("signup-infor", JSON.stringify(this.userData));
    }
  }
  
  gotoSignin() {
    this.navCtrl.pop();
  }

}
