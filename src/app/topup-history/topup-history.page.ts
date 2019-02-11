import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

@Component({
  selector: 'app-topup-history',
  templateUrl: './topup-history.page.html',
  styleUrls: ['./topup-history.page.scss'],
})
export class TopupHistoryPage implements OnInit {

  public setDefalt = [
    { "top": "unlimited1", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" },
    { "top": "unlimited2", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" },
    { "top": "unlimited1", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" },
    { "top": "unlimited2", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" },
    { "top": "unlimited1", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" },
    { "top": "unlimited2", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" },
    { "top": "unlimited1", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" },
    { "top": "unlimited1", "date": "12, March, 2017 10:12 am", "expiry": "12/04/2017", "status": "open" }
  ];

  public topData: any[];

  public userId = "";

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  gotoNewPayment() {
    this.navCtrl.navigateForward('top-up');
  }

  goback() {
    this.navCtrl.pop();
  }

  ionicInit() {
    this.topData = new Array();
    for (let list of this.setDefalt) {
      this.topData.push(list);
    }
    if (localStorage.getItem("new_topup") != null) {
      let storage = JSON.parse(localStorage.getItem("new_topup"));
      for (let list of storage) {
        let samData = { "top": "", "date": "", "expiry": "12/04/2017", "status": "Open" };
        samData.top = list.topup;
        samData.date = list.start_date;
        this.topData.push(samData);
      }
    }
    this.userId = JSON.parse(localStorage.getItem('currentUser')).username;

    this.translate.translaterService();
  }

}
