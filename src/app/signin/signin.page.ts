import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateServiceService } from '../../service/translate-service.service';
import { NavController, MenuController } from '@ionic/angular';
import { LoadingService } from '../../service/loading.service';
import { ToastService } from '../../service/toast.service';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  public userData = { "username": "", "password": "", "email": "", "phone": "", "status": "" };

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    public translate: TranslateServiceService,
    public navCtrl: NavController,
    public menu: MenuController,
    public loading: LoadingService,
    public toast: ToastService,
    public authservice: AuthService,
  ) { }

  ngOnInit() {
    // this.ionicInit();
    console.log(localStorage.getItem("logged"));
    if (localStorage.getItem("logged") != null && localStorage.getItem("logged") != "") {
      this.translate.translaterService();
      this.navCtrl.navigateForward('home');
    } else {
      this.ionicInit();
    }
  }

  ionicInit() {
    this.menu.enable(false, 'first');
    this.translate.translaterService();
  }

  signInSubmit(signInData) {
    if (signInData.valid) {
      this.loading.present();
      this.userData.email = this.userData.username;
      let status = "login";
      this.userData.status = status;

      this.authservice.login(this.userData.username, this.userData.password)

        .then(
          data => {
            if (data) {
              localStorage.setItem("logged", JSON.stringify(this.userData));
              this.authservice.fillLoggedUser(this.userData.username, this.userData.password, data);
              this.navCtrl.navigateForward('home');
            }
            this.loading.dismiss();

          },
          error => {
            this.userData.username = "";
            this.userData.password = "";
            console.log(error);
            if (error.message != null) {
              this.toast.present(error.message);
            }
            this.loading.dismiss();
          });

    }
  }

  gotoSignup() {
    this.navCtrl.navigateForward('signup');
  }

}
