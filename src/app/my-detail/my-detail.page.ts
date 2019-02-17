import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { LoadingService } from 'src/service/loading.service';
import { ToastService } from 'src/service/toast.service';
import { AuthService } from 'src/service/auth.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

@Component({
  selector: 'app-my-detail',
  templateUrl: './my-detail.page.html',
  styleUrls: ['./my-detail.page.scss'],
})
export class MyDetailPage implements OnInit {


  public userData = { "username": "", "address": "", "email": "", "phone": "", "status": "" };

  public tempData = { "email": "", "oldUserData": "", "newUserData": "", "detail": "", "status": "" };

  public changeState = { "username": false, "address": false, "email": false, "phone": false };

  public addressList: any[];
  public phoneList: any[];

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  phoneFormCtrl = new FormControl('', [
    Validators.required,
    Validators.pattern("[0-9]{8}"),
  ]);

  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public loading: LoadingService,
    public toast: ToastService,
    public authService: AuthService,
    public translate: TranslateServiceService,
  ) { }

  ngOnInit() {
    this.ionicInit();
  }

  openMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  ionicInit() {

    console.log(localStorage.getItem("set_lng"));
    this.translate.translaterService();

    this.addressList = new Array();
    this.phoneList = new Array();


    this.loading.present();
    let status = "get_detail";
    this.userData.status = status;
    this.authService.getAccountDetail().then(result => {
      if (result) {
        console.log(result);
        this.userData.username = Object(result).FullName;
        for (let list of Object(result).ContactPhoneList) {
          if (list.LastUpdated != null) {
            this.phoneList.push(Date.parse(list.LastUpdated));
          }
        }
        for (let list of Object(result).AddressList.Items) {
          if (list.LastUpdated != null) {
            this.addressList.push(Date.parse(list.LastUpdated));
          }
        }
        this.userData.email = Object(result).ContactEmailAddressList[0].EmailAddress;
        if (Object(result).AddressList.Items[this.getMaxvalueIndex(this.addressList)].Address2 != null) {
          this.userData.address = Object(result).AddressList.Items[this.getMaxvalueIndex(this.addressList)].Address1 + Object(result).AddressList.Items[this.getMaxvalueIndex(this.addressList)].Address2;
        } else {
          this.userData.address = Object(result).AddressList.Items[this.getMaxvalueIndex(this.addressList)].Address1;
        }
        this.userData.phone = Object(result).ContactPhoneList[this.getMaxvalueIndex(this.phoneList)].Number;
        if (this.userData.phone.length > 8) {
          this.userData.phone = this.userData.phone.substr(this.userData.phone.length - 8);
        }
      }
      this.loading.dismiss();
    }, error => {
      console.log("error");
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        this.authService.createRandomSessionKey().then(result => {
          if (result) {
            console.log(result);
            // localStorage.setItem('sessionKey', result);
            this.ionicInit();
          }
        }, error => {
          console.log(error);
        });
      }
      this.loading.dismiss();
    });
  }

  getMaxvalueIndex(arraySam) {
    let maxValue = arraySam[0];
    let returnIndex = 0;

    for (let list of arraySam) {
      if (maxValue < list) {
        maxValue = list;
      }
    }

    for (let i = 0; i < arraySam.length; i++) {
      if (arraySam[i] == maxValue) {
        returnIndex = i;
      }
    }
    return returnIndex;
  }

  changeUser(name) {
    switch (name) {
      case "username":
        if (this.currentState('username')) {
          if (this.changeState.username) {
            this.tempData.newUserData = this.userData.username;
            this.tempData.detail = "username";
            if (this.tempData.oldUserData != this.tempData.newUserData) {
              if (this.tempData.newUserData != "") {
                this.changeUserState();
              } else {
                this.userData.username = this.tempData.oldUserData;
              }
              this.changeState.username = !this.changeState.username;
            } else {
              this.changeState.username = !this.changeState.username;
            }
          } else {
            this.tempData.oldUserData = this.userData.username;
            this.changeState.username = !this.changeState.username;
          }
        }
        break;
      case 'email':
        if (this.currentState('email')) {
          if (this.changeState.email) {
            this.tempData.newUserData = this.userData.email;
            this.tempData.detail = "email";
            // if (this.tempData.oldUserData != this.tempData.newUserData) {
            //   if (this.tempData.newUserData != "" && (this.emailFormControl.hasError('email') && !this.emailFormControl.hasError('required'))) {
            //     this.updateEmail();
            //   } else {
            //     this.userData.email = this.tempData.oldUserData;
            //   }
            // }
            this.changeState.email = !this.changeState.email;
          } else {
            this.tempData.oldUserData = this.userData.email;
            this.changeState.email = !this.changeState.email;
          }
        }
        break;
      case 'address':
        if (this.currentState('address')) {
          if (this.changeState.address) {
            this.tempData.newUserData = this.userData.address;
            this.tempData.detail = "address";
            if (this.tempData.oldUserData != this.tempData.newUserData) {
              if (this.tempData.newUserData != "") {
                this.updateAddress();
              } else {
                this.userData.address = this.tempData.oldUserData;
              }
            }
            this.changeState.address = !this.changeState.address;
          } else {
            this.tempData.oldUserData = this.userData.address;
            this.changeState.address = !this.changeState.address;
          }
        }
        break;
      case 'phone':
        if (this.currentState('phone')) {
          if (this.changeState.phone) {
            this.tempData.newUserData = this.userData.phone;
            this.tempData.detail = "phone";
            // if (this.tempData.oldUserData != this.tempData.newUserData) {
            //   if (this.tempData.newUserData != null && this.phoneFormCtrl.valid) {
            //     this.changeState.phone = false
            //     this.updatePhone();
            //   } else {
            //     this.userData.phone = this.tempData.oldUserData;
            //   }
            // } else {
            // }
            this.changeState.phone = !this.changeState.phone;
          } else {
            this.tempData.oldUserData = this.userData.phone;
            this.changeState.phone = !this.changeState.phone;
          }
        }
        break;
    }
    console.log(this.tempData);
  }

  completeAddCompany(comProfileForm) {
    if (this.currentState('email') && comProfileForm.valid && this.emailFormControl.valid) {
      if (this.changeState.email) {
        this.tempData.newUserData = this.userData.email;
        this.tempData.detail = "email";
        if (this.tempData.oldUserData != this.tempData.newUserData) {
          if (this.tempData.newUserData != "") {
            this.updateEmail();
          } else {
            this.userData.email = this.tempData.oldUserData;
          }
        }
        this.changeState.email = !this.changeState.email;
      } else {
        this.tempData.oldUserData = this.userData.email;
        this.changeState.email = !this.changeState.email;
      }
    }
  }

  changePhone() {
    if (this.phoneFormCtrl.valid) {
      if (this.currentState('phone')) {
        if (this.changeState.phone) {
          this.tempData.newUserData = this.userData.phone;
          this.tempData.detail = "phone";
          if (this.tempData.oldUserData != this.tempData.newUserData) {
            if (this.tempData.newUserData != null) {
              this.updatePhone();
            } else {
              this.userData.phone = this.tempData.oldUserData;
            }
          } else {
          }
          this.changeState.phone = !this.changeState.phone;
        } else {
          this.tempData.oldUserData = this.userData.phone;
          this.changeState.phone = !this.changeState.phone;
        }
      }
    }
  }

  updatePhone() {
    this.loading.present();
    console.log(this.userData);
    this.authService.updatePhone(this.userData.phone).then(result => {
      console.log(result);
      this.loading.dismiss();
    }, error => {
      console.log("error");
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        var user = this.authService.getLoggedUser();
        this.authService.login(user.username, user.password).then(result => {
          // localStorage.setItem('sessionKey', result);
          this.updatePhone();
        }, error => {
        });
      }
      else {
      }
      this.loading.dismiss();
    });
  }

  updateEmail() {
    this.loading.present();
    let status = "get_detail";
    this.userData.status = status;
    console.log(this.userData);
    this.authService.updateEmail(this.userData.email).then(result => {
      console.log(result);
      this.loading.dismiss();
    }, error => {
      console.log("error");
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        var user = this.authService.getLoggedUser();
        this.authService.login(user.username, user.password).then(result => {
          // localStorage.setItem('sessionKey', result);
          this.updateEmail();
        }, error => {
        });
      }
      else {
      }
      this.loading.dismiss();
    });
  }

  updateAddress() {
    this.loading.present();
    let status = "get_detail";
    this.userData.status = status;
    console.log(this.userData);
    this.authService.updateAddress(this.userData.address).then(result => {
      console.log(result);
      this.loading.dismiss();
    }, error => {
      console.log("error");
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        var user = this.authService.getLoggedUser();
        this.authService.login(user.username, user.password).then(result => {
          // localStorage.setItem('sessionKey', result);
          this.updateAddress();
        }, error => {
        });
      }
      else {
      }
      this.loading.dismiss();
    });
  }

  changeUserState() {
    this.loading.present();

    this.tempData.email = localStorage.getItem("user_email");
    let status = "changeUserinfo";
    this.tempData.status = status;


    this.authService.updateName(this.userData.username).then(result => {
      console.log(result);
      this.loading.dismiss();
    }, error => {
      console.log("error");
      console.log(error);
      if (Object(error).Code.Name == 'InvalidSessionKeyException') {
        var user = this.authService.getLoggedUser();
        this.authService.login(user.username, user.password).then(result => {
          // localStorage.setItem('sessionKey', result);
          this.changeUserState();
        }, error => {
        });
      }
      else {
      }
      this.loading.dismiss();

    });

  }

  currentState(value) {
    let returnValue = false;
    switch (value) {
      case "username":
        if (this.changeState.address || this.changeState.email || this.changeState.phone) {
          returnValue = false;
        } else {
          returnValue = true;
        }
        break;
      case "address":
        if (this.changeState.username || this.changeState.email || this.changeState.phone) {
          returnValue = false;
        } else {
          returnValue = true;
        }
        break;
      case "email":
        if (this.changeState.address || this.changeState.username || this.changeState.phone) {
          returnValue = false;
        } else {
          returnValue = true;
        }
        break;
      case "phone":
        if (this.changeState.address || this.changeState.email || this.changeState.username) {
          returnValue = false;
        } else {
          returnValue = true;
        }
        break;

    }

    return returnValue;
  }

}
