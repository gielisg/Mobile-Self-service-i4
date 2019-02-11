import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';
import { BillService } from 'src/service/bill.service';

import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public switchMode: boolean;

  public billData = { 'billAmount': '', 'billDate': '', 'billNumber': '' };

  constructor(
    public navCtrl: NavController,
    public rooter: Router,
    public loading: LoadingService,
    public toast: ToastService,
    public file: File,
    public plt: Platform,
    public translate: TranslateServiceService,
    public menu: MenuController,
    public authservice: AuthService,
    public billservice: BillService,
  ) {
  }

  ngOnInit() {
    this.ionicInit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.ionicInit();
  }

  gotoMydetail() {
    this.navCtrl.navigateForward('my-detail');
  }

  gotoMyaccount() {
    this.navCtrl.navigateForward('my-account');
  }

  gotoMyservice() {
    this.navCtrl.navigateForward('my-service');
  }


  gotoPaynow() {
    localStorage.setItem('paynowAmount', this.billData.billAmount)
    // console.log('paynowAmount', this.billData.billAmount);
    // this.navCtrl.push(PayNowPage, { navParams: this.billData.billAmount });
    this.navCtrl.navigateForward('pay-now');

  }

  download_bill() {

  }

  clickDownload() {
    let bill_download = { "email": "", "due_date": "", "amount_owin": "", "status": "download_bill_total", "index": "" };
    bill_download.email = localStorage.getItem("user_email");

    this.loading.present();

    this.billservice.getBillFile(this.billData.billNumber)
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
          this.authservice.createRandomSessionKey().subscribe(result => {
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
      });
  }


  set_date(value) {
    let array_sam = value.split('-');
    return array_sam[1] + '-' + array_sam[2] + '-' + array_sam[0];
  }

  ionicInit() {
    this.translate.translaterService();
    this.loading.present();
    this.billservice.getBill().subscribe(data => {
      if (data) {
        // console.log(data);
        this.menu.enable(true, 'first');
        if (typeof (localStorage.getItem('set_lng')) == 'undefined' || localStorage.getItem('set_lng') == '' || localStorage.getItem('set_lng') == null) {
          this.switchMode = true;
        } else {
          if (localStorage.getItem('set_lng') == 'en') {
            this.switchMode = true;
          } else {
            this.switchMode = false;
          }
        }
        this.billData.billAmount = data.Items[0].AmountDue;
        this.billData.billNumber = data.Items[0].Number;
        this.billData.billDate = this.set_date(data.Items[0].DueDate.split('T')[0]);
      }
      this.loading.dismiss();

    }, error => {
      console.log(error);
      let errorBody = error.error;
      console.log(errorBody);
      if (errorBody.Code.Name == 'InvalidSessionKeyException') {
        console.log('aslidfuhalsiudfhaliusd');
        this.authservice.createRandomSessionKey().subscribe(result => {
          if (result) {
            console.log(result);
            localStorage.setItem('sessionKey', result);
            this.ionicInit();
          }
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });
      } else {
        this.loading.dismiss();
        this.toast.present(errorBody.Code.Name);
      }
    });

  }

  downloadPdf(pdfByte, pdfName) {

    let pathDirect = "";
    let pathFile = "";


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
