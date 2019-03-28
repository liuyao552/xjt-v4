import { AlertController, LoadingController } from '@ionic/angular';
import { Component } from '@angular/core';
import * as $ from 'jquery';
import { UserData, loginErrorMsg } from '../../services/user-data';
import { JpushService } from '../../services/jpush/jpush.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  login: any;
  submitted: boolean;
  loginErrorCode: any;
  loginErrorMsg: any;
  cordova: any;
  hideAdd: any;
  startApp: any;
  changeeyes: boolean;
  pwvisible: boolean;
  commit: boolean;
  name: any;
  psd: any;
  form: any;
  password: any;
  signup: any;
  counter: number;
  timer: any;
  issignup: boolean;
  nextSignup: boolean;
  usernamelength: boolean;
  submitDisabled: boolean;
  userAgreement: boolean;
  sixnumber: boolean;
  pwstrength: any;
  errorInput: any;
  number: boolean;
  word: boolean;
  submitable: boolean;
  comexist: boolean;
  nameexist: boolean;
  captchaUrl: any;
  errorphone: boolean;
  errorcaptcha: boolean;
  pwvisible1: boolean;
  errorusername: boolean;
  captchaname: string;
  preusername: string;
  prepassword: string;
  same: boolean;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private userData: UserData,
    private jpushService: JpushService,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.captchaUrl = this.userData.getUrl('/servlet/captchaCode');
    this.login = {};
    this.submitted = false;
    this.same = true;
    this.loginErrorMsg = null;
    this.captchaname = '获取验证码';
    this.changeeyes = true;
    this.nameexist = false;
    this.errorcaptcha = false;
    this.errorusername = false;
    this.pwvisible = true;
    this.pwvisible1 = true;
    this.commit = false;
    this.issignup = false;
    this.nextSignup = false;
    this.errorphone = false;
    this.userAgreement = true;
    this.form = {};
    this.signup = {};
    this.counter = -1;
    this.submitable = true;
    this.usernamelength = true;
  }
  ionViewDidLoad() {
    this.login.username = localStorage.getItem('username')
      ? localStorage.getItem('username')
      : '';
    this.preusername = localStorage.getItem('username')
      ? localStorage.getItem('username')
      : '';
    this.login.password = localStorage.getItem('password')
      ? localStorage.getItem('password')
      : '';
    this.prepassword = localStorage.getItem('password')
      ? localStorage.getItem('password')
      : '';

    this.password = this.login.password;
    const docEl = document.documentElement,
      resizeEvt =
        'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function() {
        // 设置根字体大小
        console.log('设置根字体大小');
        docEl.style.fontSize = 10 * (docEl.clientWidth / 320) + 'px';
      };
    docEl.style.fontSize = 10 * (docEl.clientWidth / 320) + 'px';
    // 绑定浏览器缩放与加载时间
    window.addEventListener(resizeEvt, recalc, false);
    document.addEventListener('DOMContentLoaded', recalc, false);
  }
  ionViewDidEnter() {
    document.documentElement.style.fontSize =
      10 * (document.documentElement.clientWidth / 320) + 'px' || '12px';
    this.jpushService.initJpush();
    $('.item-login2 input').keydown(event => {
      if (event.keyCode === 13) {
        this.login.password = $('.item-login2 input').val();
        this.onLogin(this.form);
      }
    });
    this.jpushService.stopPush();
  }
  ionViewWillEnter() {
      this.login.username = localStorage.getItem('username')
        ? localStorage.getItem('username')
        : '';
      this.login.password = localStorage.getItem('password')
        ? localStorage.getItem('password')
        : '';
  }

  async logout() {
    const logoutConfirmAlert = await this.alertCtrl.create({
      header: '确认注销',
      message: '确定退出当前账号？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel logout');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.userData.logout();
            this.loginService.logout().subscribe(response => {
              this.jpushService.clearAllNotification();
            });
          }
        }
      ]
    });
    logoutConfirmAlert.present();
  }
  savePassword() {
    this.password = $('.item-login2 input').val();
  }
  async onLogin(form) {
    if (form.valid || this.login.password) {
      this.submitted = true;
      const loading = await this.loadingCtrl.create({
        message: 'Please wait...'
      });
      loading.present();
      const creds =
        'username=' + this.login.username + '&password=' + this.login.password;
      this.loginService.login(creds).subscribe(
        async response => {
          const data = response;
          if (data.code === 100) {
            console.log('登录成功');
            this.userData.login(data.user);
            localStorage.setItem('needExTip', 'true');
            localStorage.removeItem('isExperience');
            this.userData.removeProjectId();
            this.router.navigate(['tabs']);
            // this.router.navigateByUrl('tabs');
           this.jpushService.setAlias(data.user.loginName);
            this.userData.addRefreshLevel();
              setTimeout(() => {
                this.jpushService.setAlias(data.user.loginName);
              }, 1000);
          } else {
            loading.dismiss();
            this.submitted = false;
            console.log('login error:' + this.loginErrorCode);
            this.loginErrorCode = data.code;
            const key = loginErrorMsg[this.loginErrorCode];
            let errmsg = this.loginErrorCode;
            if (key) {
              errmsg = this.userData.getTranslate(key);
              if (!errmsg) {
                errmsg = this.userData.getTranslate(loginErrorMsg['109']);
              }
            }
            if (this.loginErrorCode === '109') {
              this.submitted = false;
              const alert = await this.alertCtrl.create({
                header: '登录失败，请重试',
                buttons: ['确定']
              });
              alert.present();
            }
            if (this.loginErrorCode === '101' || this.loginErrorCode === '102') {
              this.submitted = false;
              const alert = await this.alertCtrl.create({
                header: '账号或密码错误',
                buttons: ['确定']
              });
              alert.present();
            } else {
              this.submitted = false;
              const alert = await this.alertCtrl.create({
                header: errmsg,
                buttons: ['确定']
              });
              alert.present();
            }
          }
        },
        err => {
          loading.dismiss();
          this.submitted = false;
          console.log(err);
          throw err;
        },
        () => {
          loading.dismiss();
          this.submitted = false;
        }
      );
    }
  }

  goSignup() {
    this.issignup = true;
  }
  goLogin() {
    this.issignup = false;
  }
  onRetrievePassword() {
    // this.nav.push('RetrievePage', { pageName: '忘记密码' }); todo
  }
  saveForm(loginForm) {
    this.form = loginForm;
  }
  changePwView(loginpw) {
      const ps = $('.pswordtype input');
      if (!localStorage.getItem('password')) {
        if (ps.attr('type') === 'password') {
          ps.attr('type', 'text');
        } else {
          ps.attr('type', 'password');
        }
      } else if (localStorage.getItem('password')) {
        if (ps.attr('type') === 'password') {
          this.login.password = '';
          localStorage.removeItem('password');
          ps.attr('type', 'text');
        } else {
          ps.attr('type', 'password');
        }
      }

    this.pwvisible = !this.pwvisible;
  }
  changePwView1() {
      const ps = $('.pswordtype1 input');
      if (ps.attr('type') === 'password') {
        ps.attr('type', 'text');
      } else {
        ps.attr('type', 'password');
      }
    this.pwvisible1 = !this.pwvisible1;
  }
  isphone() {
    if (this.errorphone) {
      const reg = /^1[0-9]{10}$/;
      const phoneNum = this.signup.telphone; // 手机号码
      if (reg.test(phoneNum)) {
        this.errorphone = false;
      } else {
      }
    }
  }
  onGetCaptcha() {
    const reg = /^1[0-9]{10}$/;
    const phoneNum = this.signup.telphone; // 手机号码
    if (reg.test(phoneNum)) {
      this.counter = 60;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          if (this.counter >= 0) {
            this.counter--;
          }
        }, 1000);
      } else {
        this.timer = setInterval(() => {
          if (this.counter >= 0) {
            this.counter--;
            if (this.counter === -1) {
              this.captchaname = '重新获取';
            }
          }
        }, 1000);
      }
      this.loginService.sendCaptcha(this.signup.telphone)
        .subscribe(response => {
          if (response === '1') {
            this.counter = -1;
            // this.userData.alertError('此号码已被注册', this.nav, null); todo
          }
        });
    } else {
      if (!this.signup.telphone) {
        // this.userData.alertError('请填写手机号', this.nav, null); // todo
      } else {
        // this.userData.alertError('请填写正确的手机号', this.nav, null); //todo
      }
    }
  }
  goNext() {
    const reg = /^1[0-9]{10}$/;
    const phoneNum = this.signup.telphone; // 手机号码
    if (reg.test(phoneNum)) {
      this.errorphone = false;
      this.loginService.valiCaptcha(this.signup.captcha, this.signup.telphone)
        .subscribe(
          response => {
            if (response.success === 'false') {
              this.errorcaptcha = true;
            } else {
              this.errorcaptcha = false;
              this.nextSignup = true;
            }
          },
          err => {
            throw err;
          },
          () => {}
        );
    } else {
      this.errorphone = true;
    }
  }
  checkUserName() {
    const promise = new Promise((resolve, reject) => {
      this.loginService.checkLoginName(this.signup.username)
        .subscribe(response => {
          if (response === 'false') {
            // this.userData.alertError('用户已存在', this_.nav, null); // todo
            this.nameexist = true;
            reject('用户已存在');
          } else {
            this.nameexist = false;
            resolve();
          }
        });
    });
    return promise;
  }
  namelength() {
    if (this.signup.username.length > 10) {
      this.usernamelength = false;
    } else {
      this.usernamelength = true;
    }
  }

  // 注册企业名称的唯一性
  checkCompanyName() {
    const promise = new Promise(function(resolve, reject) {
     this.loginService.checkCompanyName(this.signup.comname)
        .subscribe(response => {
          if (response === 'false') {
            // this.userData.alertError('公司名称已存在', this_.nav, null); // todo
            this.comexist = true;
            reject('公司名称已存在');
          } else {
            this.comexist = false;
            resolve();
          }
        });
    });
    return promise;
  }
  openAgreementPage() {
    console.log('用户协议');
    // this.nav.push('AgreementPage'); todo
  }
  showStrength() {
    this.signup.password = this.signup.password.replace(/\W/g, '');
    const strength = this.getPasswordStrength(this.signup.password);
    this.pwstrength = strength;
    const status = strength < 4 ? 'low' : strength < 6 ? 'medium' : 'high';
    const desc =
      strength < 4
        ? '密码必须包括数字和大小写字母并且六位以上'
        : strength < 6
        ? ''
        : '';
    this.errorInput = strength < 4 ? true : false;
    $('#passwordStrength')
      .attr('class', status)
      .html(desc);
    if (strength < 4) {
      this.submitDisabled = true;
    } else {
      this.submitDisabled = false;
    }
  }
  // 判断密码合法
  getPasswordStrength(password) {
    let strength = 0;
    $([/.{6,18}/, /[0-9]+/, /[a-z]+/, /[A-Z]+/]).each((
      i: number,
      o: any
    ): any => {
      if (o.test(password)) {
        strength++;
      }
    });
    $([/.{6,18}/]).each((i: number, o: any): any => {
      if (o.test(password)) {
        this.sixnumber = true;
      } else {
        this.sixnumber = false;
      }
    });
    $([/[0-9]+/]).each((i: number, o: any): any => {
      if (o.test(password)) {
        this.number = true;
      } else {
        this.number = false;
      }
    });
    $([/[a-zA-Z]+/]).each((i: number, o: any): any => {
      if (o.test(password)) {
        this.word = true;
      } else {
        this.word = false;
      }
    });
    if (password && password.length > 18) {
      strength = 3;
      this.sixnumber = false;
    }
    return strength;
  }
  // 注册
  onSignup() {
    this.submitted = true;
    // this.checkCompanyName().then(function(){
      this.checkUserName().then(
      () => {
        const creds =
          'loginName=' +
          this.signup.username +
          '&captcha=' +
          this.signup.captcha +
          '&plainPassword=' +
          this.signup.password +
          '&name=' +
          this.signup.username +
          '&companyName=' +
          this.signup.comname +
          '&tephone=' +
          this.signup.telphone;
          this.loginService.register(creds)
          .subscribe(
            async response => {
              const data = response;
              if (data.code === 100) {
                this.userData.login(data.user);
                  const alert = await this.alertCtrl.create({
                    header: '注册',
                    message: '注册成功',
                    buttons: [
                      {
                        text: '确定',
                        handler: () => {
                          // this.appCtrl.getRootNav().setRoot('TabsPage'); // todo
                        }
                      }
                    ]
                  });
                  alert.present();
                  // 注册成功后本地保存用户名和密码
                  localStorage.setItem('username', this.signup.username);
                  localStorage.setItem('password', this.signup.password);
              } else {
                console.log('login error:' + this.loginErrorCode);
                this.onRefreshCaptcha();
                this.loginErrorCode = data.code;
                if (data.code === 120) {
                  this.loginErrorMsg = data.message;
                } else {
                  const key = loginErrorMsg[this.loginErrorCode];
                  let errmsg = this.loginErrorCode;
                  if (key) {
                    errmsg = this.userData.getTranslate(key);
                    if (!errmsg) {
                      errmsg = this.userData.getTranslate(
                        loginErrorMsg['109']
                      );
                    }
                  } else {
                    errmsg = data.message;
                  }
                  this.loginErrorMsg = errmsg;
                  this.submitted = false;
                }
              }
            },
            error => {
              this.submitted = false;
            },
            () => {
              console.log('ok');
              this.submitted = false;
            }
          );
      },
      function(error) {
        this.submitted = false;
        console.error(error);
      }
    );
  }

  onRefreshCaptcha() {
    this.captchaUrl = this.userData.getUrl(
      '/servlet/captchaCode?t=' + Math.random()
    );
  }

  // 返回上一步
  goBack() {
    this.nextSignup = false;
  }

  // 判断是否有特殊字符
  isname() {
    const reg = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$');
    const username = this.signup.username; // 用户名
    if (!reg.test(username)) {
      this.errorusername = true;
    } else {
      this.errorusername = false;
    }
  }
  resetPassword() {
    console.log('重置密码');
    if (this.login.username === this.preusername) {
      this.login.password = this.prepassword;
      this.same = true;
    } else if (this.same) {
      this.login.password = '';
      this.same = false;
    }
  }
}
