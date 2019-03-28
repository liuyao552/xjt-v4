import { Injectable } from '@angular/core';
import { Events, AlertController } from '@ionic/angular';
import { IAppConfig, AppConfig } from '../config';
import * as moment from 'moment';

declare var $: any;

export const loginErrorMsg = new Object();
loginErrorMsg['100'] = 'user.error100.';
loginErrorMsg['101'] = 'user.error101';
loginErrorMsg['102'] = 'user.error102';
loginErrorMsg['105'] = 'user.error105';
loginErrorMsg['106'] = 'user.error106';
loginErrorMsg['108'] = 'user.error108';
loginErrorMsg['109'] = 'user.error109';

@Injectable({
  providedIn: 'root'
})
export class UserData {
  moment: any;
  _favorites: any;
  refreshLevel: any;
  events: any;
  USER_KEY: any;
  JWT_KEY: any;
  HAS_LOGGED_IN: string;
  PROJECT_ID_KEY: string;
  config: IAppConfig;
  constructor(
    // private config: IAppConfig,
    events: Events,
    public alertCtrl: AlertController
  ) {
    this.moment = moment;
    this.config = AppConfig;
    this._favorites = [];
    this.refreshLevel = 0;
    this.events = events;
    this.USER_KEY = 'lk_user';
    this.JWT_KEY = 'access_token';
    this.PROJECT_ID_KEY = 'lk_project_id';
  }
  isEmojiCharacter(substring) {
    for (let i = 0; i < substring.length; i++) {
      const hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          const ls = substring.charCodeAt(i + 1);
          const uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        const ls = substring.charCodeAt(i + 1);
        if (ls === 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2b05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (
          hs === 0xa9 ||
          hs === 0xae ||
          hs === 0x303d ||
          hs === 0x3030 ||
          hs === 0x2b55 ||
          hs === 0x2b1c ||
          hs === 0x2b1b ||
          hs === 0x2b50
        ) {
          return true;
        }
      }
    }
    return false;
  }
  showDate(date) {
    return this.moment(date).format('YYYY-MM-DD');
  }
  isAuthorize(role) {
    const user = localStorage.getItem(this.USER_KEY);
    let userRolesArray = [];
    if (user) {
      userRolesArray = JSON.parse(user).roles;
    }
    if (
      $.inArray('admin', userRolesArray) ||
      $.inArray('SuperAdmin', userRolesArray)
    ) {
      return true;
    }
    if (!role) {
      return false;
    }

    if (role === 'anon') {
      return true;
    }
    const checkRole = role.split(';');

    for (const key of checkRole) {
      if (checkRole[key] === 'anon') {
        return true;
      }
      if ($.inArray(checkRole[key], userRolesArray) !== -1) {
        return true;
      }
    }
    return false;
  }
  hasRole(role) {
    const user = localStorage.getItem(this.USER_KEY);
    if (user) {
      const userRoles = JSON.parse(user).roles;
      const checkRole = role.split(';');
      for (const key in checkRole) {
        if (userRoles.indexOf(checkRole[key]) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  contains(arr, obj) {
    let i = arr.length;
    while (i--) {
      if (arr[i].toLowerCase() === obj.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  getRefreshLevel() {
    return this.refreshLevel;
  }

  popRefreshLevel() {
    let retval = false;
    if (this.refreshLevel > 0) {
      retval = true;
      this.refreshLevel--;
    }

    return retval;
  }
  addRefreshLevel() {
    this.refreshLevel++;
  }
  isObject(value) {
    const type = typeof value;
    return (value && (type === 'function' || type === 'object')) || false;
  }
  serializeData(data) {
    // If this is not an object, defer to native stringification.
    if (!this.isObject(data)) {
      return data == null ? '' : data.toString();
    }

    const buffer = [];

    // Serialize each key in the object.
    for (const name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }

      const value = data[name];

      buffer.push(
        encodeURIComponent(name) +
          '=' +
          encodeURIComponent(value == null ? '' : value)
      );
    }

    // Serialize the buffer and clean it up for transportation.
    const source = buffer.join('&').replace(/%20/g, '+');
    return source;
  }
  alertSuccess(message, nav, callback) {
    // const title = this.getTranslate('common.successTitle');
    // const okButton = this.getTranslate('common.OK');
    // let msg = message;
    // if (!msg) {
    //   msg = this.getTranslate('common.successMessage');
    // }
    // if (callback) {
    //   const errorAlert = this.alertCtrl.create({
    //     title: title,
    //     message: msg,
    //     buttons: [
    //       {
    //         text: okButton,
    //         handler: callback
    //       }
    //     ]
    //   });
    //   errorAlert.present();
    // } else {
    //   let errorAlert = this.alertCtrl.create({
    //     title: title,
    //     message: msg,
    //     buttons: [okButton]
    //   });
    //   errorAlert.present();
    // }
  }
  async alertError(message, callback) {
    const header = '错误';
    const okButton = '确定';
    if (callback) {
      const errorAlert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: okButton,
            handler: callback
          }
        ]
      });
      errorAlert.present();
    } else {
      const errorAlert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [okButton]
      });
      errorAlert.present();
    }
  }
  getTranslate(key: string) {
    // let retval = this.translateParser.interpolate(
    //   '{{' + key + '}}',
    //   this.config.translation
    // );
    // return retval;
  }
  getUser() {
    const userDataStr = localStorage.getItem(this.USER_KEY);
    if (userDataStr) {
      return JSON.parse(userDataStr);
    }
  }
  getUserCloudId() {
    let user = this.getUser();
    if (!user) {
      user = new Object();
    }

    return user.cloudId;
  }
  updateUserCloudId(cloudId: string) {
    let user = this.getUser();
    if (!user) {
      user = new Object();
    }
    user.cloudId = cloudId;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  updateUserPermisions(permisions: string[]) {
    let user = this.getUser();
    if (!user) {
      user = new Object();
    }
    user.roles = permisions;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getProjectId() {
    return localStorage.getItem(this.PROJECT_ID_KEY);
  }

  updateProjectId(projectId: string) {
    localStorage.setItem(this.PROJECT_ID_KEY, projectId);
  }
  removeProjectId() {
    localStorage.removeItem(this.PROJECT_ID_KEY);
  }
  getUserLocale() {
    let user = this.getUser();
    if (!user) {
      user = new Object();
    }
    const userLocale = user.locale;
    if (!userLocale) {
      // userLocale = this.config.defaultLocale;
    }
    return userLocale;
  }
  updateUserLocale(loc: string) {
    let user = this.getUser();
    if (!user) {
      user = new Object();
    }
    user.locale = loc;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  getUserMeasurement() {
    let user = this.getUser();
    if (!user) {
      user = new Object();
    }
    const userMeasurement = user.measurement;
    if (!userMeasurement) {
      // userMeasurement = this.config.defaultMeasurement;
    }
    return userMeasurement;
  }
  updateUserMeasurement(mes: string) {
    let user = this.getUser();
    if (!user) {
      user = new Object();
    }
    user.measurement = mes;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  hasFavorite(sessionName) {
    return this._favorites.indexOf(sessionName) > -1;
  }

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName) {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  login(user) {
    localStorage.setItem(this.JWT_KEY, user.token);

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    const userLocale = this.getUserLocale();
    // this.translate.use(userLocale);
    // this.config.locale = userLocale;
    const userMeasurement = this.getUserMeasurement();
    // this.config.measurement = userMeasurement;

    this.events.publish('user:login');
  }

  signup(username, password) {
    localStorage.setItem(this.HAS_LOGGED_IN, 'true');
    this.events.publish('user:signup');
  }
  getServer() {
    const server = ''; // this.config.server;
    return server;
  }
  getUrl(url) {
    let server = ''; // this.config.server;
    const storeServer = this.config.server;
    if (storeServer != null && storeServer !== 'null') {
      server = storeServer;
    }

    if (typeof url === 'string' && !url.startsWith('http')) {
      return server + url;
    }
    return url;
  }

  getProjectUrl(url) {
    const server = ''; // this.config.server;
    const param = '';
    const projectId = this.getProjectId();

    let returl = url;
    if (typeof url === 'string' && !url.startsWith('http')) {
      returl = server + url;
    }
    if (returl.indexOf('?') !== -1) {
      returl = returl + '&_pid=' + projectId;
    }
    return returl;
  }

  getCloudUrl(url) {
    const server = ''; // this.config.server;
    const param = '';
    const cloudId = this.getUserCloudId();

    let returl = url;
    if (typeof url === 'string' && !url.startsWith('http')) {
      returl = server + url;
    }
    if (returl.indexOf('?') !== -1) {
      if (cloudId) {
        returl = returl + '&_cid=' + cloudId;
      }
    } else {
      if (cloudId) {
        returl = returl + '?_cid=' + cloudId;
      }
    }
    return returl;
  }
  logout() {
    const user = JSON.parse(localStorage.getItem(this.USER_KEY));
    if (user) {
      localStorage.removeItem(user.id);
    }
    // localStorage.removeItem(user.id);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.JWT_KEY);
    this.removeProjectId();
    this.events.publish('user:logout');
  }
  isLogin() {
    const user = JSON.parse(localStorage.getItem(this.USER_KEY));
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  // return a promise
  hasLoggedIn() {
    const user = this.getUser();
    if (user && user.loginName && user.loginName !== '') {
      // if (tokenNotExpired && tokenNotExpired('jwt')) {
        return true;
      // }
    }
    return false;
  }

  idInArray(source, object) {
    for (let i = 0; i < source.length; i++) {
      if (source[i].id === object.id) {
        return true;
      }
    }
    return false;
  }
  idRemoveInArray(source, object) {
    for (let i = 0; i < source.length; i++) {
      if (source[i].id === object.id) {
        source.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  idIndexInArray(source, object) {
    for (let i = 0; i < source.length; i++) {
      if (source[i].id === object.id) {
        return i;
      }
    }
    return -1;
  }
  getRemarkString(remark) {
    if (remark) {
      const retval = remark.replace('\r\n', '<br>');
      return retval;
    } else {
      return null;
    }
  }
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    const times = new Date().getTime();
    const retval = times + s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    return retval.substring(0, 32);
  }
  onDelete(url, nav, authHttp, callBack) {
    const title = this.getTranslate('common.deleteTitle');
    const delSubtitle = this.getTranslate('common.deleteSubtitle');
    const okButton = this.getTranslate('common.OK');
    const cancelButton = this.getTranslate('common.cancel');

    // let deleteConfirmAlert = this.alertCtrl.create({
    //   title: title,
    //   message: delSubtitle,
    //   buttons: [
    //     {
    //       text: cancelButton,
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel delete');
    //       }
    //     },
    //     {
    //       text: okButton,
    //       handler: () => {
    //         console.log('Delete clicked');
    //         authHttp
    //           .get(url, { headers: contentHeaders })
    //           .subscribe(response => {
    //             if (callBack) {
    //               callBack();
    //             }
    //             deleteConfirmAlert.dismiss();
    //             //console.log(response.text());
    //             let responseData = JSON.parse(response.text());
    //             if (responseData.success) {
    //               setTimeout(() => {
    //                 this.alertSuccess(responseData.message, nav, callBack);
    //               }, 300);
    //             } else if (
    //               responseData.error &&
    //               responseData.error.payload &&
    //               responseData.error.payload.message
    //             ) {
    //               setTimeout(() => {
    //                 this.alertError(
    //                   responseData.error.payload.message,
    //                   nav,
    //                   null
    //                 );
    //               }, 300);
    //             }
    //           });
    //       }
    //     }
    //   ]
    // });
    // deleteConfirmAlert.present();
  }
  getBlobFromBase64(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    // 类型数组
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString
    });
  }
  setHomeTitle(hometitle) {
    const user = JSON.parse(localStorage.getItem(this.USER_KEY));
    const title = 'hometitle' + user.id;
    localStorage.setItem(title, hometitle);
  }
  getHomeTitle() {
    const user = JSON.parse(localStorage.getItem(this.USER_KEY));
    const title = 'hometitle' + user.id;
    return localStorage.getItem(title);
  }
}
