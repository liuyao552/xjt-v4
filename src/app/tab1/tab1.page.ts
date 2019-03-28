import { Events, AlertController, ToastController, ModalController, MenuController } from '@ionic/angular';
import { OnInit, Component, ErrorHandler } from '@angular/core';
import { UserData } from '../services/user-data';
import { Storage } from '@ionic/storage';
// import * as $ from 'jquery';
import { BdageProvider } from '../services/bdage/bdage';
import { Router } from '@angular/router';
import { HomeService, Permission } from './tab1.service';
import { LoginService } from '../pages/login/login.service';
import { JpushService } from '../services/jpush/jpush.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  slideOpts = {
    loop: true,
    autoplay: {
      delay: 2000,
    }
  };
  search_statusType: string;
  conditionStr: string;
  homeData: any;
  datas: any;
  q: string;
  pageNo: any;
  searching: boolean;
  refresherObj: any;
  hasNext: any;
  cancelSearchbar: any;
  projects: any;
  joins: any;
  hometitle: any;
  projectId: string;
  hasAlertNetwork: boolean;
  noShowNum: any;
  isPush: boolean;
  ifHome: boolean;
  isExperience: boolean;
  waterGage: any;
  showContent: any;
  pullText: boolean;
  dataLoaded: boolean;
  navArr: number[];
  isfirst: any;
  constructor(
    // private ngzone: NgZone,
    public events: Events,
    private toastCtrl: ToastController,
    private errorHandler: ErrorHandler,
    public alertCtrl: AlertController,
    private storage: Storage,
    public menuCtrl: MenuController,
    private userData: UserData,
    public modalCtrl: ModalController,
    private bdageProvider: BdageProvider,
    private router: Router,
    private homeService: HomeService,
    private loginService: LoginService,
    private jpushService: JpushService,
  ) {
    this.isfirst = localStorage.getItem('needExTip') || 'true';
    this.search_statusType = '18';
    this.conditionStr = 'search_EQ_periodTask=false';
    this.homeData = new Object();
    this.navArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.datas = [];
    this.q = '';
    this.pageNo = 1;
    this.searching = false;
    this.projects = [];
    this.joins = [];
    this.noShowNum = true;
    this.isPush = true;
    this.ifHome = true;
    this.isExperience = true;
    this.showContent = false;
    this.dataLoaded = false;
    if (
      this.userData.getUser().loginName === 'test_wy' ||
      this.userData.getUser().loginName === 'test_wbr' ||
      this.userData.getUser().loginName === 'test_yz' ||
      this.userData.getUser().loginName === 'test_xjy' ||
      this.userData.getUser().loginName === 'test_sbcs' ||
      this.userData.getUser().loginName === 'test_bxr' ||
      this.userData.getUser().loginName === 'test_jgbm' ||
      this.userData.getUser().loginName === 'test_qt'
    ) {
      this.isExperience = false;
    }
    events.subscribe('badge:change', bdageobj => {
      // this.ngzone.run(() => {
        this.homeData = bdageobj.taskCount;
      // });
    });
    events.subscribe('user:created', (pid, time) => {
      if (this.projectId !== pid) {
        this.projectId = pid;
        console.log(this.projectId);
        this.pagination(null);
      } else {
        console.log('没有切换项目');
      }
    });
  }

  ngOnInit() {}

  // 打开首页更多功能
  openSolveMethod() {
    // this.nav.push('solveMethod'); todo
  }
  // 概览页面进入体验页面
  opneExperience() {
    // this.nav.push('ExperiencePage', { ifHome: this.ifHome }); todo
  }
  // 打开筛选
  showMenue() {
    if (this.projects.length === 0 && this.joins.length === 0) {
      this.alertCtrl
        .create({
          header: '提示',
          subHeader: '您暂无项目，前往pc端完善项目信息可使用更多功能',
          buttons: ['确定']
        })
        .then(alert => alert.present());
    } else {
      this.menuCtrl.enable(true, 'homefilter');
      this.menuCtrl.open('homefilter');
    }
  }
  // 筛选确定
  filterMaterial() {
    this.menuCtrl.close('homefilter');
  }

  // 点击新闻跳转到新闻页面
  openFindPage() {
    // this.nav.push('CmFindPage'); todo
  }
  // 第三方集成功能增加
  // 防火门
  openFireProofDoor() {
    if (this.isPush) {
      this.isPush = false;
      // this.nav.push('fireProofDoor'); tofo
    }
    this.isPush = true;
  }
  // 消防电源
  openFirePower() {
    if (this.isPush) {
      this.isPush = false;
      // this.nav.push('firePower'); todo
    }
    this.isPush = true;
  }
  // 无线烟感
  openWirelessSmoke() {
    if (this.isPush) {
      this.isPush = false;
      // this.nav.push('wirelessSmoke'); todo
    }
    this.isPush = true;
  }
  // 及早期
  openVeryEarly() {
    if (this.isPush) {
      this.isPush = false;
      // this.nav.push('veryEarly'); todo
    }
    this.isPush = true;
  }
  // 电气火灾
  openElectricFire() {
    if (this.isPush) {
      this.isPush = false;
      // this.nav.push('ElectricPage'); todo
    }
    this.isPush = true;
  }
  // 应急逃生
  openEmergencyEscape() {
    if (this.isPush) {
      this.isPush = false;
      // this.nav.push('emergencyEscape');
    }
    this.isPush = true;
  }
  // 验证权限
  VerifyPermissions(funType: string) {
    if (this.isPush) {
      this.isPush = false;
      let pageUrl = '';
      let title = '';
      switch (funType) {
        case 'fire':
          pageUrl = 'fireEngineChart';
          title = '火警主机';
          break;
        case 'fireAlarm':
          pageUrl = 'fireAlarm';
          title = '火眼警报';
          break;
        default:
          break;
      }
      this.homeService.VerifyPermissions(funType).subscribe(
        (response: Permission) => {
          if (response.tag) {
            // this.nav.push('fireAlarm');
            // this.router.navigate([])
          } else {
            // this.nav.push('NoallowPage', { title: '火眼警报' });
          }
          this.isPush = true;
        },
        err => {
          this.isPush = true;
          throw err;
        },
        () => {
          this.isPush = true;
        }
      );
    }
  }

  ionViewWillLeave() {
    if (localStorage.getItem('submit')) {
      localStorage.removeItem('submit');
    }
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.bdageProvider.loadMessageCount();
    // 获取消防百事通第一条新闻
    // this.getFirstNews();
  }

  ionViewDidEnter() {
    document.documentElement.style.fontSize =
      10 * (document.documentElement.clientWidth / 320) + 'px' || '12px';
    // if (this.waterGage) {
    //   $('.tab-button')
    //     .eq(1)
    //     .css('display', 'none');
    //   $('.tab-button')
    //     .eq(2)
    //     .css('display', 'block');
    // } else {
    //   $('.tab-button')
    //     .eq(1)
    //     .css('display', 'block');
    //   $('.tab-button')
    //     .eq(2)
    //     .css('display', 'none');
    // }

    this.hasAlertNetwork = false;
    if (this.userData.popRefreshLevel()) {
      console.log('1');
      this.doRefresh(null);
    } else if (this.refresherObj) {
      console.log('2');
      this.refresherObj.complete();
    } else if (this.userData.isLogin()) {
      const userId = this.userData.getUser().id + 'PROJECT';
      this.storage.get(userId).then(text => {
        if (text) {
          const retval = text;
          console.log(retval);
          if (
            retval &&
            retval.entity &&
            retval.entity.cloudId === this.userData.getUserCloudId()
          ) {
            this.noShowNum = false;
            this.loadProjectData(retval);
          }
        }
        this.doRefresh(null);
      });
    }

    localStorage.removeItem('isTaskcheck');
  }

  openPage(title: String) {
    console.log('进入页面+');
  }

  openMaterialLocPage(uncheck, taskcheck, select) {
    // this.nav.push('dailyFailureView');
  }

  doRefresh(refresher) {
    console.log('doRefresh...');
    this.onReload(refresher);
  }
  loadMoreData(infiniteScroll) {
    console.log('loadMoreData...');

    if (this.hasNext) {
      this.pageNo += 1;
      if (this.userData.getProjectId()) {
        this.pagination(infiniteScroll);
      }
    } else {
      console.log('No next page.');
      infiniteScroll.complete();
    }
  }
  onReload(event) {
    this.datas = [];
    this.pageNo = 1;
    const projectId = this.userData.getProjectId();
    if (projectId === '14982273316675f884cb01b97413cbcb' && event) {
      this.onlogin(event);
    } else {
      this.pagination(event);
    }
  }

  openProductPage() {
    // this.nav.push('StoreProductPage');
  }
  openTaskPage(type, select, taskType) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId()) {
        localStorage.setItem('isTask', '1');
        // this.nav.push('TasksPage', { type: type, taskType: taskType });
      } else {
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }
  openTaskPage1(select, taskType) {
    if (this.userData.isLogin()) {
      console.log(this.userData.getProjectId());
      if (this.userData.getProjectId()) {
        localStorage.setItem('isTask', '1');
        // this.nav.push('TasksPage', { taskType: taskType });
      } else {
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  openCheckRecord(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId()) {
        // this.nav.push('MtCheckRecordPage');
      } else {
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  openUnImplementPage(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId()) {
        // this.nav.push('UnImplementPage');
      } else {
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  openOflineTaskPage(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId()) {
        // this.nav.push('OflineTasksPage');
      } else {
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  openReviewPage(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId()) {
        // this.nav.push('ReviewPage');
      } else {
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  loadProjectData(retval) {
    if (!retval.taskCount) {
      this.homeData.periodPatrolCount = 0;
      this.homeData.periodMaintainCount = 0;
      this.homeData.assignPartrolCount = 0;
      this.homeData.assignTestingCount = 0;
      this.homeData.assignMaintainCount = 0;
      this.homeData.dailyPatrolCount = 0;
      this.homeData.dailyMaintainCount = 0;
      this.projects = [];
      this.alertTip(null);
      if (localStorage.getItem('isExperience') === 'true') {
        this.onLoginByYZ(null);
      }
    } else {
      if (retval.projects.length === 0 && retval.joins.length === 0) {
        if (this.alertTip(null)) {
          // this.onLoginByYZ(null);
        } else {
        }
        if (localStorage.getItem('isExperience') === 'true') {
          this.onLoginByYZ(null);
        }
      }
      this.homeData = retval.taskCount;
      this.userData.updateUserPermisions(retval.permisions);
      console.log(this.userData.getUser());

      if (retval.entity && retval.entity.id) {
        this.projectId = retval.entity.id;
      }
      this.userData.updateProjectId(this.projectId);
      this.loadAppData();
      this.judgePhotograph();
      if (retval.projects) {
        this.projects = retval.projects;
      }

      this.joins = retval.joins;
      if (retval.entity && retval.entity.name) {
        this.hometitle = retval.entity.name;
        this.userData.setHomeTitle(this.hometitle);
      }
      if (this.noShowNum) {
        let num = retval.SMSCount;
        if (num > 999) {
          num = '999+';
        }
        if (!num || num === '0') {
          // $('.tab-badge').html('')
        } else {
          // $('.tab-badge').html(num)
        }
        console.log(num);
      }
      this.noShowNum = true;
    }
  }
  pagination(event) {
    if (event) {
      this.pullText = true;
    } else {
      this.pullText = false;
    }
    let ptxt = 'null';
    const projectId = this.userData.getProjectId();
    if (projectId) {
      ptxt = projectId;
    }
    if (event && projectId === '14982273316675f884cb01b97413cbcb') {
      ptxt = 'null';
    }
    if (!ptxt || ptxt === 'undefined') {
      ptxt = 'null';
    }

    if (this.userData.hasLoggedIn()) {
      try {
        this.homeService.getProjectData(ptxt)
        .subscribe(
          response => {
            const retval = response;
            this.loadProjectData(retval);
            const userId = this.userData.getUser().id + 'PROJECT';
            this.storage.set(userId, response);
            this.dataLoaded = true;
            this.pullText = false;
            ptxt = this.projectId;
            // 获取水压权限的单独接口
            this.homeService.getWaterGageOEMS(ptxt)
            .subscribe(
              res => {
                this.showContent = true;
                // 判断水压权限
                this.waterGage = res.waterGageOEMS;
                // if (this.waterGage) {
                //   $('.tab-button')
                //     .eq(1)
                //     .css('display', 'none');
                //   $('.tab-button')
                //     .eq(2)
                //     .css('display', 'block');
                // } else {
                //   $('.tab-button')
                //     .eq(1)
                //     .css('display', 'block');
                //   $('.tab-button')
                //     .eq(2)
                //     .css('display', 'none');
                // }
              },
              err => {
                console.log('getWaterGageOEMS');
                this.showContent = false;
              },
              () => {
                console.log('the project complete');
              }
            );
            if (retval.projects && retval.projects.length === 0) {
              this.userData.updateUserCloudId(retval.cloudId);
            }
          },
          err => {
            if (event) {
              event.target.complete();
              throw err;
            }
            if (!this.hasAlertNetwork) {
              this.hasAlertNetwork = true;
              throw err;
            }
          },
          () => {
            console.log('pagination Complete');
            if (event) {
              event.target.complete();
            }
          }
        );
      } catch (e) {
        if (!this.hasAlertNetwork) {
          this.hasAlertNetwork = true;
          this.errorHandler.handleError(e);
        }
      }
    } else {
      this.homeData = [];
      if (event) {
        event.target.complete();
      }
    }
  }

  // 故障报修
  openMaterialLocPageAa(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId()) {
        // this.nav.push('malfunctionRepairList');
      } else {
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }
  openProlist() {
    this.alertCtrl.create({
      header: '提示',
      // subTitle: '请先登录消检通网址：<p>http://app.xiaojiantong.com/xjt</p>完善项目信息',
      subHeader: '您暂无项目，前往pc端完善项目信息可使用更多功能。',
      buttons: ['确定']
    }).then(alert => alert.present());
  }

  changePro(select) {
    if (this.projects.length === 0 && this.joins.length === 0) {
      this.openProlist();
    } else {
      select.open();
    }
  }

  // 请求项目
  loadProjects() {
    this.homeService.getProjectList()
    .subscribe(
      response => {
        this.projects = response.rows;
      },
      err => {
        throw err;
      },
      () => {
        console.log('load project Complete');
      }
    );
  }
  // 关闭menu
  closemenu() {
    this.menuCtrl.close('mcrfilter');
  }
  changeProject(project) {
    this.hometitle = project.name;
    this.userData.setHomeTitle(this.hometitle);
    this.userData.updateProjectId(this.projectId);
    if (project) {
      this.userData.updateUserCloudId(project.cloudId);
      this.loadAppData();
      console.log('user cloud id:' + project.cloudId);
    }

    this.pagination(null);
    this.menuCtrl.close('homefilter');
  }
  getProject(pid) {
    for (let i = 0; i < this.projects.length; i++) {
      const project = this.projects[i];
      if (project.id === pid) {
        return project;
      }
    }
    for (let i = 0; i < this.joins.length; i++) {
      const project = this.joins[i];
      if (project.id === pid) {
        return project;
      }
    }
    return;
  }

  openSys(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId()) {
        // this.nav.push('HomeCheckSystemPage');
      } else {
        /*let toast = this.toastCtrl.create({
					 message:'请选择项目',
					 duration:1000
				   });
				 toast.present(toast);*/
        this.openProlist();
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  openCCCF() {
    // this.nav.push('ScanCccfPage');
  }
  openScanView() {
    // this.nav.push('ReScanViewPage', { isRegister: true });
  }
  // 水压监测
  openWaterGage() {
    if (this.isPush) {
      this.isPush = false;
      // this.nav.push('WatergapePage');
    }
    this.isPush = true;
  }
  // 获取消防百事通第一条新闻
  // getFirstNews() {
  //   console.log(22222);
  //   $.ajax({
  //     url:
  //       'http://new.fire114.cn/ServerZX/GetListAll.cwg?count=1&cwgdataHandler=windowvar&cwgdataHandler_windowvar=a',
  //     type: 'GET',
  //     dataType: 'JSONP', //here
  //     success: function(data) {
  //       console.log(data);
  //     }
  //   });
  // }

  // 消火栓
  openHydrant() {
    // this.nav.push('eqmapPage');
  }

  // 水浸
  openWaterLog() {
    // this.nav.push('WaterloggingListPage');
  }

  // 获取应用列表
  loadAppData() {
    this.homeService.getNavList()
    .subscribe(
      response => {
        if (response.data.type) {
          console.log(response.data.type);
          this.navArr = response.data.type.split(',');
          this.navArr = this.navArr.map(item => {
            return +item;
          });
        } else {
          this.navArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        }
        console.log(this.navArr);
      },
      err => {
        throw err;
      },
      () => {
        console.log('load project Complete');
      }
    );
  }

  gotoPage(n, select) {
    if (
      (!this.userData.getProjectId() || this.userData.getProjectId() === '0') &&
      n !== 0
    ) {
      this.openProlist();
      return;
    }
    switch (n) {
      case 0:
        this.openCCCF();
        break;
      case 1:
        this.openTaskPage1(select, 1);
        break;
      case 2:
        this.openTaskPage1(select, 3);
        break;
      case 3:
        this.openTaskPage1(select, 2);
        break;
      case 4:
        this.VerifyPermissions('fire');
        break;
      case 5:
        this.VerifyPermissions('fireAlarm');
        break;
      case 6:
        this.openElectricFire();
        break;
      case 7:
        this.go('GasFiredListPage');
        break;
      case 8:
        this.go('SmockDetectorListPage');
        break;
      case 9:
        this.openHydrant();
        break;
      case 10:
        this.openWaterGage();
        break;
      case 11:
        this.openWaterLog();
        break;
      case 12:
        this.openScanView();
        break;
      case 13:
        this.openSys(select);
        break;
      case 14:
        this.openCheckRecord(select);
        break;
      case 15:
        this.openMaterialLocPageAa(select);
        break;
      case 16:
        this.openMaterialLocPage(false, true, select);
        break;
      case 17:
        this.openOflineTaskPage(select);
        break;
      case 18:
        this.openReviewPage(select);
        break;
      case 19:
        this.openUnImplementPage(select);
        break;
      default:
        break;
    }
  }

  goSolution() {
    // this.nav.push('IotSolutionPage');
  }

  openModelDemo() {
    // this.nav.push('ModeldemoPage');
  }

  alertTip(event) {
    console.log(this.isfirst);
    if (this.isfirst === 'true') {
      this.isfirst = 'false';
      localStorage.setItem('needExTip', 'false');
      this.alertCtrl
        .create({
          header: '温馨提示',
          subHeader: `欢迎使用消检通，请开始您的智慧消防之旅吧`,
          // cssClass: 'extip',
          buttons: [
            {
              text: '暂不',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                 this.toastCtrl.create({
                  message: '您暂无项目，前往PC端完善项目信息可使用更多功能。',
                  duration: 2000,
                  cssClass: 'expresstip',
                  position: 'middle'
                }).then(toast => toast.present());
                localStorage.setItem('isExperience', 'false');
              }
            },
            {
              text: '体验',
              handler: () => {
                this.toastCtrl.create({
                  message:
                    '您已进入体验项目，前往PC端完善项目信息可使用更多功能。',
                  duration: 2000,
                  cssClass: 'expresstip',
                  position: 'middle'
                }).then(toast => toast.present());
                localStorage.setItem('isExperience', 'true');
                this.onLoginByYZ(event);
              }
            }
          ]
        }).then(alert => alert.present());
      return false;
    } else {
      return true;
      //    this.onLoginByYZ(event);
    }
  }
  // 选择角色登录
  onLoginByYZ(event) {
    const id = 'test_yz';
    const psd = 'Xjt123';
    const creds = 'username=' + id + '&password=' + psd;
    this.loginService.login(creds)
      .subscribe(
        response => {
          if (response.code === 100) {
            this.userData.login(response.user);
            this.userData.updateProjectId('14982273316675f884cb01b97413cbcb');
            this.setAlias(response);
            this.pagination(event);
          }
        },
        err => {},
        () => {}
      );
  }

  // 判断有无拍照权限
  judgePhotograph() {
    this.homeService.getPhotograph()
    .subscribe(
      response => {
        const resS = JSON.stringify(response);
        localStorage.setItem('photograph', resS);
      },
      err => {
        throw err;
      },
      () => {
        console.log('load Complete');
      }
    );
  }

  onlogin(event) {
    let id = 'test_yz';
    let psd = 'Xjt123';
    id = localStorage.getItem('username')
      ? localStorage.getItem('username')
      : 'test_yz';
    psd = localStorage.getItem('password')
      ? localStorage.getItem('password')
      : 'Xjt123';

    const creds = 'username=' + id + '&password=' + psd;
    this.loginService.login(creds)
      .subscribe(
        response => {
          if (response.code === 100) {
            this.userData.login(response.user);
            this.userData.removeProjectId();
            this.setAlias(response);
            this.pagination(event);
          }
        },
        err => {},
        () => {}
      );
  }
  go(dataType: string) {

  }
show(item){
  console.log(item);
}
  setAlias(data) {
    try {
      const alias = data.user.loginName;
      this.jpushService.setAlias(alias);
    } catch (ex) {
      console.log(ex);
    }
  }

  trackByFn(index, item) {
    return item.id;
  }
}
