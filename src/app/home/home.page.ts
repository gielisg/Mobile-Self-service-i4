import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { AuthService } from 'src/service/auth.service';
import { BillService } from 'src/service/bill.service';

// import { File } from '@ionic-native/file';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public switchMode: boolean;

  public billData = { 'billAmount': '', 'billDate': '' };

  constructor(
    public navCtrl: NavController,
    public rooter: Router,
    public loading: LoadingService,
    public toast: ToastService,
    // public file: File,
    public translate: TranslateServiceService,
    public menu: MenuController,
    public authservice: AuthService,
    public billservice: BillService,
  ) {
    console.log(localStorage.getItem('currentUser'));
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
    // this.navCtrl.push(MyaccountPage);
  }

  gotoMyservice() {
    // this.navCtrl.push(MyServicesPage);
  }


  gotoPaynow() {
    // this.navCtrl.push(PayNowPage, { navParams: this.billData.billAmount });
  }
  download_bill() {

  }

  clickDownload() {
  }


  set_date(value) {
    let array_sam = value.split('-');
    return array_sam[1] + '-' + array_sam[2] + '-' + array_sam[0];
  }

  ionicInit() {
    this.loading.present();
    this.billservice.getBill().subscribe(data => {
      if (data) {
        console.log(data);
        this.menu.enable(true, 'first');
        this.translate.translaterService();
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
        this.billData.billDate = this.set_date(data.Items[0].DueDate.split('T')[0]);
      }
      this.loading.dismiss();

    }, error => {
      console.log(error);
      if (error.error.$type.includes('InvalidSessionKeyException')) {
        // this.authservice.createRandomSessionKey().subscribe(result => {
        //   if (result) {
        //     // console.log(result);
        //     localStorage.setItem('sessionKey', result);
        //     this.ionicInit();
        //   }
        // }, error => {
        //   console.log(error);
        //   this.loading.dismiss();
        // });
      }
      this.loading.dismiss();
    });

    console.log('data');
  }

}
