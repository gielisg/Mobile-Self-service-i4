import { Component, ViewChild } from '@angular/core';

import { Platform, Events, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {


  public pages: Array<{ title: string, component: any, image: string }>;
  public bottomPages: Array<{ title: string, component: any, image: string }>;

  public menuTitle: any;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService,
    public events: Events,
    public navCtrl: NavController,
    public menuCtrl: MenuController
  ) {

    console.log(this.navCtrl);

    events.subscribe('user:created', (user, time) => {
      this.ionicInit();
    });

    this.ionicInit();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.title == 'asdfasdf') {
      alert("click");
    } else {
      this.translate.get('logout').subscribe(
        value => {
          this.menuCtrl.close('first');
          if (page.title == value) {
            localStorage.setItem("logged", "");
            this.navCtrl.navigateRoot('signin');
          } else {
            this.navCtrl.navigateForward(page.component);
          }

        }
      );
    }
  }

  ionicInit() {

    this.pages = [
      { title: 'home', component: 'home', image: "home" },
      { title: 'my_details', component: 'my-detail', image: "list" },
      { title: 'my_account', component: 'my-account', image: "person_icon" },
      { title: 'my_services', component: 'my-service', image: "visa_card" },
    ];

    this.bottomPages = [
      { title: 'settings', component: 'settings', image: "setting" },
      { title: 'logout', component: null, image: "log_out" },
    ];

    this.translate.addLangs(['en', 'ru']);
    this.translate.setDefaultLang(localStorage.getItem('set_lng') != null ? localStorage.getItem('set_lng') : "en");
    this.translate.use(localStorage.getItem('set_lng') != null ? localStorage.getItem('set_lng') : "en");

    for (let list of this.pages) {
      this.translate.get(list.title).subscribe(
        value => {
          list.title = value;
        }
      );
    }

    for (let list of this.bottomPages) {
      this.translate.get(list.title).subscribe(
        value => {
          list.title = value;
        }
      );
    }

    this.translate.get('menu').subscribe(result => {
      this.menuTitle = result;
    });

  }
}
