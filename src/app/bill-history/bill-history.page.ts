import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { AuthService } from 'src/service/auth.service';
import { BillService } from 'src/service/bill.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-bill-history',
  templateUrl: './bill-history.page.html',
  styleUrls: ['./bill-history.page.scss'],
})
export class BillHistoryPage implements OnInit {

  public userData = { "username": "", "address": "", "email": "", "phone": "", "status": "" };

  public detailData = [];

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public authService: AuthService,
    public billService: BillService,
    public file: File,
    public plt: Platform,
    public translate: TranslateServiceService,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  goback() {
    this.navCtrl.pop();
  }

  ionicInit() {
    this.loading.present();
    this.translate.translaterService();

    this.billService.getBillList()
      .subscribe(
        data => {
          if (data) {
            // this.userData.email = localStorage.getItem("user_email");
            this.detailData = Array();
            for (let list of Object(data).Items) {
              let arrayData = { "billNum": "", "dueDate": "", "amountOwin": "" };
              arrayData.billNum = list.Number.replace(/ /g, '');
              arrayData.amountOwin = list.AmountDue;
              arrayData.dueDate = (list.DueDate.split("T")[0]);
              this.detailData.push(arrayData);

            }
            this.convertBillList();
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

  convertBillList() {
    let sam = this.detailData;
    this.detailData = new Array();
    for (let i = sam.length - 1; i >= 0; i--) {
      this.detailData.push(sam[i]);
    }
  }


  download(index) {
    let billDownload = { "billNum": "", "dueDate": "", "amountOwin": "", "status": "download_bill", "index": "" };
    billDownload.billNum = this.detailData[index].billNum;
    billDownload.dueDate = this.detailData[index].dueDate;
    billDownload.amountOwin = this.detailData[index].amountOwin;
    billDownload.index = index;

    this.loading.present();


    this.billService.getBillFile(this.detailData[index].billNum).subscribe(result => {
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
            this.download(index);
          }
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });
      }
      this.loading.dismiss();
    });
  }

  toUTF8Array(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6),
          0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      }
      else {
        i++;
        charcode = 0x10000 + (((charcode & 0x3ff) << 10)
          | (str.charCodeAt(i) & 0x3ff));
        utf8.push(0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      }
    }
    return utf8;
  }

  convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
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
