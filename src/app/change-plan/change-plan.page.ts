import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { TranslateServiceService } from 'src/service/translate-service.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-change-plan',
  templateUrl: './change-plan.page.html',
  styleUrls: ['./change-plan.page.scss'],
})
export class ChangePlanPage implements OnInit {


  public changeState = { "newState": "", "reason": "", "effect_date": "", "note": "" };

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

  changePlanSubmit(comProfileForm) {
    if (this.changeDate.valid && this.Reason.valid && this.newState.valid) {
      let data = this.changeState.newState;
      this.modalCtrl.dismiss({ data: this.changeState.newState });
    }
  }

  ionicInit() {
    let current_state = JSON.parse(localStorage.getItem("ChangePlanPage"));

    this.changeState.newState = current_state.plan;

    this.translate.translaterService();
  }
}
