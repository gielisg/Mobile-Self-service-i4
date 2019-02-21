import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateServiceService {

  constructor(
    public translate: TranslateService,
  ) {
    this.translate.addLangs(['en', 'ru']);
  }

  translaterService() {
    if (typeof (localStorage.getItem("set_lng")) == "undefined" || localStorage.getItem("set_lng") == "" || localStorage.getItem("set_lng") == null) {
      localStorage.setItem("set_lng", "en");
      this.translate.use('en');
    } else {
      this.translate.use(localStorage.getItem("set_lng"));
    }
  }

  convertText(value) {
    return this.translate.get(value);
  }

  setLang(lang) {
    this.translate.use(lang);
  }
}
