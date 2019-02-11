import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Platform } from '@ionic/angular';
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

  public billData = { "billAmount": "", "billDate": "", "accountNumber": "", 'billNumber': '' };

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public authService: AuthService,
    public billService: BillService,
    public file: File,
    public plt: Platform,
    public translate: TranslateServiceService,
    public menu: MenuController,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  ionicInit() {

    this.translate.translaterService();
    this.loading.present();

    this.billService.getBillList()
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.billData.billAmount = Object(data).Items[0].AmountDue;
          this.billData.billDate = this.setDate(Object(data).Items[0].DueDate.split("T")[0]);
          this.billData.accountNumber = Object(data).Items[0].ContactCode;
          this.billData.billNumber = Object(data).Items[0].Number;
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
          let errorBody = error.error;
          console.log(errorBody);
          if (errorBody.Code.Name == 'InvalidSessionKeyException') {
            this.authService.createRandomSessionKey().subscribe(result => {
              if (result) {
                console.log(result);
                localStorage.setItem('sessionKey', result);
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
    this.navCtrl.navigateForward('bill-history');
  }
  gotoTransactionHistory() {
    this.navCtrl.navigateForward('transaction-history');
  }
  gotoPaymentHistory() {
    this.navCtrl.navigateForward('payment-method');
  }
  gotoPayNow() {
    console.log(this.billData.billAmount);
    localStorage.setItem('paynowAmount', this.billData.billAmount)
    // console.log('paynowAmount', this.billData.billAmount);
    // this.navCtrl.push(PayNowPage, { navParams: this.billData.billAmount });
    this.navCtrl.navigateForward('pay-now');
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

    this.billService.getBillFile(this.billData.billNumber)
      .subscribe(result => {
        console.log(result);

        if (Object(result).Content != null && typeof (Object(result).Content) != "undefined") {
          console.log("here");
          var pdf = 'data:application/pdf;base64,' + Object(result).Content.$value;
          let pdfName = Object(result).FileName;
          console.log("here");
          this.downloadPdf(pdf, pdfName);
        }

        this.loading.dismiss();

      }, error => {
        console.log(error);
        let errorBody = error.error;
        console.log(errorBody);
        if (errorBody.Code.Name == 'InvalidSessionKeyException') {
          this.authService.createRandomSessionKey().subscribe(result => {
            if (result) {
              console.log(result);
              localStorage.setItem('sessionKey', result);
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

  downloadPdf(pdfByte, pdfName) {

    let pathDirect = "";
    let pathFile = "";

    console.log(this.file);

    if (this.plt.is('android')) {
      pathDirect = this.file.externalApplicationStorageDirectory;
      pathFile = this.file.externalApplicationStorageDirectory + "Self_Service/";
    } else if (this.plt.is('ios')) {
      pathDirect = this.file.tempDirectory;
      pathFile = this.file.tempDirectory + "Self_Service/";
    }

    if (!this.plt.is('desktop')) {
      this.file.checkDir(pathDirect, 'Self_Service').then((resultCheck) => {
        console.log(resultCheck);
        this.file.writeFile(pathFile, pdfName, this.convertBaseb64ToBlob(pdfByte, 'data:application/pdf;base64'), { replace: true });
      }, (error) => {
        this.file.createDir(pathDirect, 'Self_Service', false).then((DirectoryEntry) => {
          this.file.writeFile(pathFile, pdfName, this.convertBaseb64ToBlob(pdfByte, 'data:application/pdf;base64'), { replace: true });
        }, (error) => {
          console.log("Create error");
        });
      });
    }

  }

  convertBaseb64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }



}
