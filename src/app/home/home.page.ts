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
    private loading: LoadingService,
    private toast: ToastService,
    private file: File,
    private plt: Platform,
    private translate: TranslateServiceService,
    private menu: MenuController,
    private authservice: AuthService,
    private billservice: BillService,
  ) {
  }

  ngOnInit() {
    this.ionicInit();
    console.log(window.location.href);
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
    // this.navCtrl.push(PayNowPage, { navParams: this.billData.billAmount });
    this.navCtrl.navigateForward('pay-now');

  }

  download_bill() {

  }

  clickDownload() {
    // let bill_download = { "email": "", "due_date": "", "amount_owin": "", "status": "download_bill_total", "index": "" };
    // bill_download.email = localStorage.getItem("user_email");

    this.loading.present();

    this.billservice.getBillFile(this.billData.billNumber).then(result => {
      console.log(result);

      if (Object(result).Content != null && typeof (Object(result).Content) != "undefined") {
        var pdf = 'data:application/pdf;base64,' + Object(result).Content.$value;
        let pdfName = Object(result).FileName;
        this.downloadPdf(pdf, pdfName);
      } else {
        this.toast.present('The Bill you trying to download is unavailable at the moment. Sorry for the inconvenience.' +
          ' Please try again later. Please contact Support Team. Error: Bill not available to download yet.');
      }

      this.loading.dismiss();

    }, error => {
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        this.authservice.createRandomSessionKey().then(result => {
          if (result) {
            console.log(result);
            // localStorage.setItem('sessionKey', Object(result));
            this.clickDownload();
          }
        }, error => {
          console.log(error);
        });
      }
      this.loading.dismiss();
    });
  }


  set_date(value) {
    let arraySam = value.split('-');
    return arraySam[1] + '-' + arraySam[2] + '-' + arraySam[0];
  }

  ionicInit() {
    this.translate.translaterService();

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

    this.loading.present();
    this.billservice.getBill().then(data => {
      if (data) {
        // console.log(data);
        this.billData.billAmount = Object(data).Items[0].AmountDue;
        this.billData.billNumber = Object(data).Items[0].Number;
        this.billData.billDate = this.set_date(Object(data).Items[0].DueDate.split('T')[0]);
      }
      this.loading.dismiss();

    }, error => {
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        this.authservice.createRandomSessionKey().then(result => {
          if (result) {
            console.log(result);
            // localStorage.setItem('sessionKey', Object(result));
            this.ionicInit();
          }
        }, error => {
        });
      } else {
        this.toast.present(Object(error).Code.Name);
      }
      this.loading.dismiss();
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
