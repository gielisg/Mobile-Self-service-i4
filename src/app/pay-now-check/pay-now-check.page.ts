import { Component, OnInit } from '@angular/core';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pay-now-check',
  templateUrl: './pay-now-check.page.html',
  styleUrls: ['./pay-now-check.page.scss'],
})
export class PayNowCheckPage implements OnInit {

  constructor(
    public translate: TranslateServiceService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.translate.translaterService();
  }

  gotoPaymenthistory() {
    this.modalCtrl.dismiss({ data: "paynowCheck" });
  }

}
