import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceService } from 'src/service/translate-service.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {

  public setDefault = [
    { "tranNum": "3014657", "type": "receipt", "date": "12 / 18", "amount": "0.01", "status": "precessing" },
    { "tranNum": "5275851", "type": "receipt", "date": "12 / 18", "amount": "0.01", "status": "precessing" },
    { "tranNum": "8548948", "type": "receipt", "date": "02 / 18", "amount": "0.01", "status": "precessing" },
    { "tranNum": "3879948", "type": "receipt", "date": "01 / 19", "amount": "0.01", "status": "precessing" },
    { "tranNum": "2438789", "type": "receipt", "date": "07 / 19", "amount": "0.01", "status": "precessing" },
    { "tranNum": "3878978", "type": "receipt", "date": "06 / 19", "amount": "0.01", "status": "precessing" }
  ];

  public transactionList: any[];
  public showMoreState: boolean;

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
    this.transactionList = new Array();
    this.showMoreState = true;
    for (let list of this.setDefault) {
      this.transactionList.push(list);
    }
    this.translate.translaterService();
  }

  addMoreAction() {
    if (this.transactionList.length + this.setDefault.length < 25) {
      for (let list of this.setDefault) {
        this.transactionList.push(list);
      }
      this.showMoreState = true;
    } else {
      this.showMoreState = false;
    }

    if (this.transactionList.length > 25) {
      this.showMoreState = false;
    }


  }

}
