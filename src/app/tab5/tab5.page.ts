import { Events, AlertController, Platform } from '@ionic/angular';
import { Component, ErrorHandler } from '@angular/core';
import { UserData } from '../services/user-data';
import { AppConfig, IAppConfig } from '../config';
import { Badge } from '@ionic-native/badge/ngx';
import { BdageProvider } from '../services/bdage/bdage';
import * as $ from 'jquery';
import { Tab5Service } from './tab5.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})

export class Tab5Page {
  hasLoggedIn: boolean;
  user: any;
  locales: any;
  userLocale: any;
  userMeasurement: any;
  messageCount: any;
  projectId: any;
  ios: any;
  cordova: any;
  image: any;
  com: any;
  needRefresh: boolean;

  config: IAppConfig;
  constructor(public alertCtrl: AlertController,
    private userData: UserData, private events: Events, public platform: Platform,
    private bdageProvider: BdageProvider, private badge: Badge, private tab5Service: Tab5Service) {
    this.config = AppConfig;
    this.hasLoggedIn = userData.hasLoggedIn();
    this.ios = platform.is('ios');
    this.cordova = platform.is('cordova');
    this.listenToLoginEvents();
    this.locales = this.config.locales.split('|');
    this.userLocale = this.config.locale;
    this.userMeasurement = this.config.measurement;
    this.projectId = this.userData.getProjectId();
    this.image = {};
    this.user = {};
  }

  ionViewWillEnter() {
    this.loadUser();
    // 体验账号不可修改密码和信息
    // 正式环境和测试环境判断
    if (this.projectId === '14982273316675f884cb01b97413cbcb') {
      $('.user-page .modifyPsd').attr('disabled', 'true');

    }
    if (this.projectId === '14982273316675f884cb01b97413cbcb') {
      // this.loginByStorage();
    }
  }
  login() {
    // this.appCtrl.getRootNav().setRoot('LoginPage');
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.hasLoggedIn = this.userData.hasLoggedIn();
    });

    this.events.subscribe('user:signup', () => {
      this.hasLoggedIn = this.userData.hasLoggedIn();
    });

    this.events.subscribe('user:logout', () => {
      this.hasLoggedIn = this.userData.hasLoggedIn();
    });
  }

  ionViewDidEnter() {
    this.projectId = this.userData.getProjectId();
    if (this.userData.popRefreshLevel()) {
      this.needRefresh = true;
      if (!this.projectId || this.projectId !== '14982273316675f884cb01b97413cbcb') {
        this.loadUser();
      }
    }
    if (!this.projectId) {
      console.log('未找到项目id');
    } else {
     this.bdageProvider.loadBdage();
    }
    this.hasLoggedIn = this.userData.hasLoggedIn();
    this.userLocale = this.config.locale;
    this.userMeasurement = this.config.measurement;
  }

  logout() {
    this.userData.logout();
    this.tab5Service.logout()
      .subscribe(
        response => {
          this.userData.removeProjectId();
          this.badge.clear();
        },
        err => {
          throw err;
        },
        () => {
          console.log('load project Complete');
        }
      );
  }

  goAbout() {
    // this.nav.push('AboutPage');
  }
  modifyInfo() {
    if (this.projectId !== '14982273316675f884cb01b97413cbcb') {
      // this.nav.push('ModifyPage');
    }
  }
  goHelp() {
    // this.nav.push('HelpPage')
  }
  loadUser() {
    this.tab5Service.getUser()
      .subscribe(
        response => {
          this.user = response.user;
          if (response.com) {
            this.com = response.com;
          }
          if (response.images) {
            if (this.needRefresh) {
              this.image.src = this.userData.getUrl('/file/attachment/download/' + response.images.id) + '?' + Math.random();
            } else {
              this.image.src = this.userData.getUrl('/file/attachment/download/' + response.images.id);
            }
          } else {
            this.image.src = 'assets/img/head_geren.png';
          }
        },
        err => {
          console.log('catch loadmessage')
          // throw err;
        },
        () => {
          console.log('load messageCount Complete');
        }
      );
  }
  async waiting() {
    const alert = await this.alertCtrl.create({
      header: '提示',
      subHeader: '即将开放，敬请期待',
      buttons: ['确定']
    });
    alert.present();
  }

  // 打开问题反馈页面
  problemBack() {
    // this.nav.push('ProblemBackPage');
  }

  // 离线登记下载页面
  goRegisterDownload() {
    // this.nav.push('ScanDownloadPage');
  }
  // 登记页面
  goRegister() {
    // this.nav.push('ProjectUploadPage');
  }
  onimgerror(dom) {
    this.image.src = 'assets/img/head_geren.png';
    console.log('图片加载失败');
  }
}
