import { AlertController, ToastController } from '@ionic/angular';
import {
  Injectable,
  ErrorHandler,
} from '@angular/core';
import { UserData } from './user-data';
import { IAppConfig } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ExceptionHandler implements ErrorHandler {
  toastsef: any;
  constructor(
    private config: IAppConfig,
    private alert: AlertController,
    private userData: UserData,
    private toastCtrl: ToastController,
  ) {}
  handleError(exception) {
    console.log(exception);
    if (exception instanceof Response) {
      if (!this.toastsef) {
        this.toastsef = this.toastCtrl.create({
          message: `连接错误，请稍后重试`,
          duration: 2000,
          position: 'middle'
        });
        this.toastsef.onDidDismiss(() => {
          console.log('Dismissed toast');
          this.toastsef = null;
        });
        this.toastsef.present();
      } else {
        this.toastsef.dismiss();
        this.toastsef = null;
      }
    } else if (
      exception === 'No JWT present or has expired' ||
      exception.message === 'No JWT present or has expired' ||
      exception.originalError === 'No JWT present or has expired' ||
      (exception.rejection &&
        exception.rejection.originalError === 'No JWT present or has expired') ||
      (exception.originalError &&
        exception.originalError.message === 'No JWT present or has expired')
    ) {
      localStorage.removeItem('lk_user');
      localStorage.removeItem('jwt');
      if (this.config.nav) {
        // this.appCtrl.getRootNav().setRoot('LoginPage');
      } else {
        // this.appCtrl.getRootNav().setRoot('LoginPage');
        const title = '提示';
        const subTitle = '登陆超时';
        const okButton = this.getTranslate('common.OK');
       this.alert.create({
          header: title,
          subHeader: subTitle,
          buttons: ['确定']
        }).then(alert => alert.present());
      }
    }
  }
  showDetail() {
    const shadebox = document.createElement('div');
    shadebox.className = 'myShadeBox';
    const shade = document.createElement('div');
    shade.className = 'myAlert';
    shade.innerHTML = '连接错误,请稍后再重试';
    shadebox.appendChild(shade);
    document.getElementById('nav').appendChild(shadebox);
    setTimeout(function() {
      shadebox.style.display = 'none';
    }, 1500);
  }
  call(exception: any, stackTrace: any, reason: string): void {
    console.log(exception);
    if (exception instanceof Response) {
      const title = '提示';
      const okButton = this.getTranslate('common.OK');
      console.log('toast');
      this.alert.create({
        header: title,
        buttons: ['确定']
      }).then(alert => alert.present());
    } else if (
      exception === 'Invalid JWT' ||
      exception.originalException === 'Invalid JWT' ||
      (exception.rejection &&
        exception.rejection.originalException === 'Invalid JWT')
    ) {
      localStorage.removeItem('lk_user');
      localStorage.removeItem('jwt');

      console.log('执行++');
      if (this.config.nav) {
      } else {
        const title = '提示';
        const subTitle = '登陆超时';
        const okButton = this.getTranslate('common.OK');
        this.alert.create({
          header: title,
          subHeader: subTitle,
          buttons: ['确定']
        }).then(alert => alert.present());
      }
    }
  }
  getTranslate(key: string) {
    const retval = this.userData.getTranslate(key);
    return retval;
  }

  simpleStringify(object) {
    const simpleObject = {};
    for (const prop in object) {
      if (!object.hasOwnProperty(prop)) {
        continue;
      }
      if (typeof object[prop] === 'object') {
        continue;
      }
      if (typeof object[prop] === 'function') {
        continue;
      }
      simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
  }
}
