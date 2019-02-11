import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { FormControl, Validators } from '@angular/forms';
import { NavController, MenuController, Events } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public selectLng: any;

  selectFormControl = new FormControl('', [Validators.required]);

  constructor(
    public navCtrl: NavController,
    public translate: TranslateServiceService,
    public cdr: ChangeDetectorRef,
    public menuCtrl: MenuController,
    public events: Events,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  gotoChangePass() {
    this.navCtrl.navigateForward('change-password');
  }

  ionicInit() {

    this.menuCtrl.enable(true, 'first');

    if (typeof (localStorage.getItem("set_lng")) == "undefined" || localStorage.getItem("set_lng") == "" || localStorage.getItem("set_lng") == null) {
      this.selectLng = "en";
    } else {
      this.selectLng = localStorage.getItem("set_lng");
    }

    this.translate.translaterService();

  }

  selectedLng() {
    localStorage.setItem("set_lng", this.selectLng);
    this.createUser("This is fake");
    this.ionicInit();
  }

  ngAfterViewChecked() {
    this.translate.setLang(this.selectLng);
    this.events.publish('user:login');
    this.cdr.detectChanges();
  }

  openMenu() {
    this.menuCtrl.enable(true, 'first');
    this.menuCtrl.open('first');
  }

  createUser(user) {
    this.events.publish('user:created', user, Date.now());
  }

  ngAfterViewInit() {
    this.translate.setLang(this.selectLng);
    this.events.publish('user:login');
    this.cdr.detectChanges();
  }

}
