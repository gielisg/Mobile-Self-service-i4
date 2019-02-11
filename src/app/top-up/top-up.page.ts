import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.page.html',
  styleUrls: ['./top-up.page.scss'],
})
export class TopUpPage implements OnInit {

  public topData = { "topup": "", "startDate": "", "method": "" };

  public showError = false;
  public confirmError = false;

  selType = new FormControl('', [Validators.required]);

  setMethod = new FormControl('', [Validators.required]);

  selExy = new FormControl('', [Validators.required]);

  changeDate = new FormControl('', [Validators.required]);

  constructor(
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public translate: TranslateServiceService,
  ) { }

  ngOnInit() {
    this.ionicInit();
    this.showError = false;
  }

  completeAddCompany(comProfileForm) {

    if (this.topData.startDate != null && this.topData.startDate != "") {
      this.showError = false;
    } else {
      this.showError = true;
    }

    console.log(this.showError);
    console.log(this.topData.startDate);
    this.confirmError = true;


    if (comProfileForm.valid && this.setMethod.valid && this.selType.valid && this.topData.startDate != null && this.topData.startDate != "") {
      let tempTotal = { "topup": "", "startDate": "", "method": "" };
      tempTotal.method = this.topData.method;
      tempTotal.topup = this.topData.topup;
      let datetimearray = this.topData.startDate.split("T");
      let sam = this.setDate(datetimearray[0]) + " " + this.setTime(datetimearray[1]);
      tempTotal.startDate = sam;
      if (localStorage.getItem("newTopup") != null) {
        let oldData = new Array();
        for (let list of JSON.parse(localStorage.getItem("newTopup"))) {
          oldData.push(list);
        }
        oldData.push(tempTotal);
        localStorage.setItem("newTopup", JSON.stringify(oldData));
      } else {
        let newArray = new Array();
        newArray.push(tempTotal);
        localStorage.setItem("newTopup", JSON.stringify(newArray));
      }

      this.navCtrl.navigateForward('topup-history');
    }
  }

  goback() {
    this.navCtrl.pop();
  }

  addNew() {
    console.log(this.topData.startDate);
    if (this.setMethod.valid && this.selType.valid && this.topData.startDate != null && this.topData.startDate != "") {
      let tempTotal = { "topup": "", "startDate": "", "method": "" };
      tempTotal.method = this.topData.method;
      tempTotal.topup = this.topData.topup;
      let datetimearray = this.topData.startDate.split("T");
      let sam = this.setDate(datetimearray[0]) + " " + this.setTime(datetimearray[1]);
      tempTotal.startDate = sam;
      if (localStorage.getItem("newTopup") != null) {
        let oldData = new Array();
        for (let list of JSON.parse(localStorage.getItem("newTopup"))) {
          oldData.push(list);
        }
        oldData.push(tempTotal);
        localStorage.setItem("newTopup", JSON.stringify(oldData));
      } else {
        let newArray = new Array();
        newArray.push(tempTotal);
        localStorage.setItem("newTopup", JSON.stringify(newArray));
      }
      this.topData.startDate = "";
      this.topData.method = "";
      this.topData.topup = "";
      this.confirmError = false;
    }
  }

  ionchangeDate() {
    console.log(this.showError);
    console.log(this.confirmError);
    console.log(this.topData.startDate);
    if (this.confirmError && this.topData.startDate == "") {
      this.showError = true;
    } else {
      this.showError = false;
    }
    console.log(this.showError);
    console.log(this.confirmError);
    console.log(this.topData.startDate);
  }

  ionicInit() {
    this.translate.translaterService();
  }

  setDate(value) {
    let arraySam = value.split("-");
    console.log(arraySam);
    return arraySam[1] + "/" + arraySam[2] + "/" + arraySam[0];
  }

  setTime(value) {
    let arraySam = value.split(":");
    console.log(arraySam);
    let returnVal = "";
    if (parseInt(arraySam[0]) > 12) {
      if (parseInt(arraySam[0]) - 12 < 10) {
        returnVal = "0" + (arraySam[0] - 12).toFixed(0) + ":" + arraySam[1] + " pm";
      } else {
        returnVal = (arraySam[0] - 12).toFixed(0) + ":" + arraySam[1] + " pm";
      }
    } else {
      returnVal = arraySam[0] + ":" + arraySam[1] + " am";
    }
    return returnVal;
  }

}
