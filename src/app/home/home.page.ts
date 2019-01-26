import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public rooter: Router,
  ) {
    console.log(localStorage.getItem('currentUser'));
  }
  ionViewDidLoad() {
    console.log(localStorage.getItem('currentUser'));
  }

  gotoSignIn() {
    this.navCtrl.navigateForward('signin');
  }

}
