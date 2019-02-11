import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateServiceService } from 'src/service/translate-service.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.page.html',
  styleUrls: ['./service-detail.page.scss'],
})
export class ServiceDetailPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public translate: TranslateServiceService,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  goback() {
    this.navCtrl.pop();
  }

  ionicInit() {
    this.translate.translaterService();
  }

}
