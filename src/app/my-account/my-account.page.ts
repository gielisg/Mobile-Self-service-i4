import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { AuthService } from 'src/service/auth.service';
import { BillService } from 'src/service/bill.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  public switchMode: boolean;

  public billData = { "billAmount": "", "billDate": "", "accountNumber": "" };

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public authService: AuthService,
    public billService: BillService,
    public file: File,
    public translate: TranslateServiceService,
    public menu: MenuController,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  ionicInit() {

    this.loading.present();

    this.billService.getBillList()
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.billData.billAmount = Object(data).Items[0].AmountDue;
          this.billData.billDate = this.setDate(Object(data).Items[0].DueDate.split("T")[0]);
          this.billData.accountNumber = Object(data).Items[0].ContactCode;
          this.translate.translaterService();
          if (localStorage.getItem("set_lng") == "en") {
            this.switchMode = true;
          } else {
            this.switchMode = false;
          }

        }
        this.loading.dismiss();

      },
        error => {
          console.log(error);
          let errorBody = JSON.parse(error._body);
          console.log(errorBody);
          if (errorBody.Code.Name == 'InvalidSessionKeyException') {
            this.authService.createRandomSessionKey().subscribe(result => {
              if (result) {
                console.log(result);
                // localStorage.setItem('sessionKey', result);
                this.ionicInit();
              }
            }, error => {
              console.log(error);
              this.loading.dismiss();
            });
          }
          this.loading.dismiss();
        });
  }
  gotoBillHistory() {
    // this.navCtrl.push(BillHistoryPage);
  }
  gotoTransactionHistory() {
    // this.navCtrl.push(TransactionHistoryPage);
  }
  gotoPaymentHistory() {
    // this.navCtrl.push(PaymentMethodPage);
  }
  gotoPayNow() {
    // this.navCtrl.push(PayNowPage, { navParams: this.billData.billAmount });
  }
  download_bill() {

    // const url = "http://localhost/test_php/MyPDF.pdf";

    // this.file.checkDir('file:///storage/emulated/0/', 'Self_Service').then((result_check) => {

    //   this.fileTransfer.download(url, 'file:///storage/emulated/0/Self_Service/' + 'Bill Data.pdf').then((entry) => {
    //     this.toast.show('download complete: ' + entry.toURL())
    //   }, (error) => {
    //     console.log('download failed');
    //   });

    // }, (error) => {

    //   this.file.createDir('file:///storage/emulated/0/', 'Self_Service', false).then((DirectoryEntry) => {
    //     this.fileTransfer.download(url, 'file:///storage/emulated/0/Self_Service/' + 'Bill Data.pdf').then((entry) => {
    //       this.toast.show('download complete: ' + entry.toURL())
    //     }, (error) => {
    //       console.log('download failed');
    //     });
    //   }, (error) => {
    //     console.log("Create error");
    //   });

    // });
  }

  clickDownload() {
    // let status = "download_bill_total";
    let bill_download = { "email": "", "due_date": "", "amount_owin": "", "status": "download_bill_total", "index": "" };
    bill_download.email = localStorage.getItem("user_email");

    this.loading.present();

    this.billService.getBillList()
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.billData.billAmount = Object(data).Items[0].AmountDue;
          this.billData.billDate = this.setDate(Object(data).Items[0].DueDate.split("T")[0]);
        }
        this.loading.dismiss();

      }, error => {
        console.log(error);
        let errorBody = JSON.parse(error._body);
        console.log(errorBody);
        if (errorBody.Code.Name == 'InvalidSessionKeyException') {
          this.authService.createRandomSessionKey().subscribe(result => {
            if (result) {
              console.log(result);
              // localStorage.setItem('sessionKey', result);
              this.clickDownload();
            }
          }, error => {
            console.log(error);
            this.loading.dismiss();
          });
        }
        this.loading.dismiss();
      });
  }


  setDate(value) {
    let array_sam = value.split("-");
    return array_sam[1] + "-" + array_sam[2] + "-" + array_sam[0];
  }

  openMenu() {
    this.menu.open('first');
  }


}
