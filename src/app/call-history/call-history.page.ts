import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.page.html',
  styleUrls: ['./call-history.page.scss'],
})
export class CallHistoryPage implements OnInit {

  public callHistoryData = [
    { "callNum": "04155188882", "date": "12, March, 2017 10:15 am", "duration": "15 seconds", "tariff": "Plan Z", "cost": "0.15" },
    { "callNum": "46546565658", "date": "12, March, 2017 10:15 am", "duration": "15 seconds", "tariff": "Plan Z", "cost": "0.15" },
    { "callNum": "45378345383", "date": "12, March, 2017 10:15 am", "duration": "15 seconds", "tariff": "Plan Z", "cost": "0.15" },
    { "callNum": "45373453783", "date": "12, March, 2017 10:15 am", "duration": "15 seconds", "tariff": "Plan Z", "cost": "0.15" },
    { "callNum": "83783838754", "date": "12, March, 2017 10:15 am", "duration": "15 seconds", "tariff": "Plan Z", "cost": "0.15" },
    { "callNum": "23889373834", "date": "12, March, 2017 10:15 am", "duration": "15 seconds", "tariff": "Plan Z", "cost": "0.15" }
  ];

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  goback() {
    this.navCtrl.pop();
  }

  ionicInit() {

    this.translate.translaterService();

  }

}
