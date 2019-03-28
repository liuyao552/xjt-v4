import { AlertController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BasePageProvider {
  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    private location: Location
  ) {}

  /**
   *页面跳转
   *
   */
  go(page: string, pageParams?: any) {
    this.router.navigate([page]);
  }

  /**
   * 页面返回
   */
  pop(opts) {
    this.location.back();
  }

  /**
   * 弹窗
   */
  alertBox(alertCtrl: AlertController, opts) {
    return new Promise((resolve, reject) => {
      opts = Object.assign(
        {
          title: '确认删除？',
          message: '删除后关联数据将无法恢复',
          buttons: [
            {
              text: '取消',
              handler: () => {
                resolve(false);
              }
            },
            {
              text: '确定',
              handler: () => {
                resolve(true);
              }
            }
          ]
        },
        opts
      );
      alertCtrl.create(opts).then(alert => alert.present());
      // alert.present();
    });
  }

  commonAlert(header: string, message: string) {
    this.alertCtrl
      .create({
        header: header,
        message: message
      })
      .then(alert => alert.present());
  }

  /**
   * 提示
   */
  async commonToast(toastCtrl: ToastController, msg: string) {
    const toast = await toastCtrl.create({ message: msg, duration: 1500 });
    toast.present();
  }
}
