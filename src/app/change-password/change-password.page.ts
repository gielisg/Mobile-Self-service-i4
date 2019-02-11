import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public userData = { "email": "", "oldPass": "", "newPass": "", "status": "" };

  public send_data: any[];

  constructor(
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
    public authService: AuthService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  completeAddCompany(comProfileForm) {
    if (comProfileForm.valid) {

    }
  }
  goback() {
    this.navCtrl.pop();
  }

  ionicInit() {
    this.translate.translaterService();
  }

}
