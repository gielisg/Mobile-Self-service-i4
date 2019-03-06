import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { TransactionService } from 'src/service/transaction.service';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {

  public setDefault: any[];

  public transactionList: any[];
  public showMoreState: boolean;

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
    private tranService: TransactionService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  goback() {
    this.navCtrl.pop();
  }

  ionicInit() {
    this.transactionList = new Array();
    this.setDefault = new Array();
    this.showMoreState = true;

    this.translate.translaterService();

    this.loading.present();

    this.tranService.getTransactionHistory().then((data: any) => {
      console.log(data);
      for (let list of data.Items) {
        this.setDefault.push(list);
        // console.log(list.Number);
      }
      // console.log(this.setDefault);
      this.addMoreAction();
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

  addMoreAction() {
    this.loading.present();
    if (this.transactionList.length < this.setDefault.length) {
      // for (let list of this.setDefault) {
      //   this.transactionList.push(list);
      // }
      if (this.setDefault.length - this.transactionList.length > 25) {
        let arrayNum = 0;
        if (this.transactionList.length == 0) {
          arrayNum = 0;
        } else {
          arrayNum = this.transactionList.length - 1;
          setTimeout(() => {
            this.loading.dismiss();
          }, 1500);
        }
        for (let i = arrayNum; i <= arrayNum + 25; i++) {
          console.log(i);
          let param = { "tranNum": "", "type": "", "date": "12 / 18", "amount": "0.01", "status": "precessing" };
          param.tranNum = this.setDefault[i].Number;
          param.type = this.setDefault[i].Type.Name;
          param.amount = this.setDefault[i].Total;
          param.status = this.setDefault[i].Status.Name;
          param.date = this.setDefault[i].Date.split('T')[0].split('-')[1] + ' / ' + this.setDefault[i].Date.split('T')[0].split('-')[2];
          this.transactionList.push(param);
        }
      } else {
        let arrayNum = 0;
        if (this.transactionList.length == 0) {
          arrayNum = 0;
        } else {
          arrayNum = this.transactionList.length - 1;
          setTimeout(() => {
            this.loading.dismiss();
          }, 1500);
        }
        for (let i = arrayNum; i < this.setDefault.length; i++) {
          let param = { "tranNum": "", "type": "", "date": "12 / 18", "amount": "0.01", "status": "precessing" };
          param.tranNum = this.setDefault[i].Number;
          param.type = this.setDefault[i].Type.Name;
          param.amount = this.setDefault[i].Total;
          param.status = this.setDefault[i].Status.Name;
          param.date = this.setDefault[i].Date.split('T')[0].split('-')[1] + ' / ' + this.setDefault[i].Date.split('T')[0].split('-')[2];
          this.transactionList.push(param);
        }
      }

      this.showMoreState = true;
    } else {
      this.showMoreState = false;
    }

    if (this.transactionList.length >= this.setDefault.length) {
      this.showMoreState = false;
    }


  }

}
