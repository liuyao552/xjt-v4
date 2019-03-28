import { Injectable } from '@angular/core';
import { JPush } from '@jiguang-ionic/jpush/ngx';
import { UserData } from '../user-data';
import { AppConfig } from '../../config';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class JpushService {
  constructor(
    private jPush: JPush,
    private userData: UserData,
    private platform: Platform,
  ) {}

  // 初始化极光推送
  initJpush() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.jPush.init();
    this.jPush.isPushStopped().then(data => {
      console.log('jpushstatus======================', data);
    });
    const alias = this.userData.getUser()
      ? this.userData.getUser().loginName
      : null;
    if (alias) {
      if (AppConfig.server === 'http://test2.xiaojiantong.com/xjt') {
        this.jPush.setAlias({ sequence: 1, alias: '*' + alias });
      } else {
        this.jPush.setAlias({ sequence: 1, alias: alias });
      }
    } else {
      try {
        this.jPush.deleteAlias({ sequence: 1 });
        this.jPush.stopPush();
      } catch (ex) {
        console.log('-----login this.JPush error------');
        console.log(ex);
      }
    }
  }

  stopPush() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.jPush.stopPush();
  }

  clearAllNotification() {
    if (!this.platform.is('cordova')) {
      return;
    }
    if (this.jPush) {
      this.jPush.clearAllNotification();
    }
  }

  setAlias(name) {
    if (!this.platform.is('cordova')) {
      return;
    }
    try {
      const alias = name;
      if (alias) {
        if (this.jPush) {
          this.jPush.resumePush();
          if (AppConfig.server === 'http://test2.xiaojiantong.com/xjt') {
            this.jPush
              .setAlias({
                sequence: 1,
                alias: '*' + alias
              })
              .then(result => {
                console.log(
                  '设置别名=====================================login=======',
                  alias
                );
                console.log(result);
              });
          } else {
            this.jPush.setAlias({ sequence: 1, alias: alias });
          }
          console.log('-----login alias------');
          console.log(alias);
        }
      }
    } catch (ex) {
      console.log('-----login this.JPush error------');
      console.log(ex);
    }
  }
}
