import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { AuthService } from 'src/service/auth.service';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { BillService } from 'src/service/bill.service';
import { ChangePlanPage } from '../change-plan/change-plan.page';
import { ChangeStatusPage } from '../change-status/change-status.page';

@Component({
  selector: 'app-my-service',
  templateUrl: './my-service.page.html',
  styleUrls: ['./my-service.page.scss'],
})
export class MyServicePage implements OnInit {


  public serviceData: any[];

  public monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public authService: AuthService,
    public billService: BillService,
    public translate: TranslateServiceService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  setDate(value) {
    let arraySam = value.split("-");
    return arraySam[2] + ", " + this.monthNames[parseInt(arraySam[1])] + " " + arraySam[0];
  }

  getTypeSV(value) {
    let arraySam = value.split(".");
    return arraySam[0].charAt(0) + "" + arraySam[1].charAt(0) + "" + arraySam[2].charAt(0);
  }

  gotoCallHistory() {
    // this.navCtrl.push(CallHistoryPage);
  }

  gotoTopupHistory() {
    // this.navCtrl.push(TopupHistoryPage);
  }

  gotoServiceDetail() {
    // this.navCtrl.push(ServiceDetailPage);
  }

  gotoServiceBundle() {
    // this.navCtrl.push(ServiceBundlePage);
  }

  ionicInit() {

    this.serviceData = new Array();
    this.loading.present();

    this.billService.getServiceDisplay().subscribe(data => {
      console.log(data);
      if (data) {
        this.translate.translaterService();
        for (let list of Object(data).Items) {
          let arrayData = { "type": "GSM", "number": "", "date": "", "status": "open", "plan": "saver1", "changeState": false, "changePlan": false };
          arrayData.type = this.getTypeSV(list.$type.split(",")[0]);
          arrayData.number = list.Number;
          arrayData.date = this.setDate(list.DueDate.split("T")[0]);

          this.serviceData.push(arrayData);

        }
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

  async changeState(index) {

    let changeData = { "index": "", "status": "" };
    changeData.index = index;
    changeData.status = this.serviceData[index].status;
    localStorage.setItem("ChangeStatusPage", JSON.stringify(changeData));

    const profileModal = await this.modalCtrl.create({
      component: ChangeStatusPage,
    });

    profileModal.onDidDismiss().then((data) => {
      if (typeof (data) != "undefined" && data != "") {
        this.serviceData[index].plan = data;
      }
    });
    await profileModal.present();

  }

  saveState(index) {

    this.serviceData[index].changeState = false;

  }

  async changePlan(index) {

    let changeData = { "index": "", "plan": "" };
    changeData.index = index;
    changeData.plan = this.serviceData[index].plan;
    localStorage.setItem("ChangePlanPage", JSON.stringify(changeData));

    const profileModal = await this.modalCtrl.create({
      component: ChangePlanPage,
    });

    profileModal.onDidDismiss().then((data) => {
      if (typeof (data) != "undefined" && data != "") {
        this.serviceData[index].plan = data;
      }
    });
    await profileModal.present();

  }

  savePlan(index) {
    this.serviceData[index].changePlan = false;
  }

  openMenu() {
    this.menu.open('first');
  }

}
