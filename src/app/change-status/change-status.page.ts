import { Component, OnInit } from '@angular/core';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { ModalController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.page.html',
  styleUrls: ['./change-status.page.scss'],
})
export class ChangeStatusPage implements OnInit {


  public changeState = { "newState": "", "reason": "", "effectDate": "", "note": "" };

  newState = new FormControl('', [Validators.required]);

  Reason = new FormControl('', [Validators.required]);

  changeDate = new FormControl('', [Validators.required]);



  constructor(
    public translate: TranslateServiceService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  goback() {
    this.modalCtrl.dismiss({ data: "" });
  }

  changeStatusSubmit(comProfileForm) {
    if (this.newState.valid && this.Reason.valid && this.changeDate.valid) {
      let data = this.changeState.newState;
      this.modalCtrl.dismiss({ data: this.changeState.newState });
    }
  }

  ionicInit() {

    let current_state = JSON.parse(localStorage.getItem("ChangeStatusPage"));
    this.changeState.newState = current_state.status;
    this.translate.translaterService();
  }

}
