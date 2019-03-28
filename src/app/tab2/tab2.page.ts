import { Events, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { BdageProvider } from '../services/bdage/bdage';
import { UserData } from '../services/user-data';
import * as $ from 'jquery';
import { HomeService } from '../tab1/tab1.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  homeData: any;
  datas: any;
  maintabs: any;
  refresherObj: any;
  checkUpdateVersion: any;
  projects: any;
  joins: any;
  hometitle: any;
  projectId: string;
  gender: any;
  hasAlertNetwork: boolean;
  noShowNum: any;
  mySwiper2: any;
  isNoneDataL: any;
  isPush: boolean;
  ifHome: boolean;
  isExperience: boolean;
  homeNews: any;
  pageNo: number;
  navArr: number[];

  constructor(public events: Events,
    private bdageProvider: BdageProvider,
    private userData: UserData,
    private homeService: HomeService,
    private alertCtrl: AlertController) {
    this.homeData = new Object();
    this.datas = [];
    this.noShowNum = true;
    this.isPush = true;
    this.ifHome = true;
    this.isExperience = true;
    this.navArr = [12, 13, 14, 15, 16, 17, 18, 19];
  }

  ngOnInit() {
    this.onReload(null);
  }
  openNews(object) {
    // this.nav.push('CmFindViewPage', { 'id': object.id });
  }

  // 获取新闻图片
  getUmageUrl(imageId) {
    return this.userData.getUrl('/file/attachment/thumbnail/' + imageId + '/150_150');
  }
  // 打开消防百事通
  openFirePage() {
    // this.nav.push('BrowserPage', {
    //   browser: {
    //     title: '消防资讯',
    //     url: 'http:// new.fire114.cn/zxapp/Zxlist'
    //   }
    // });
  }
  // 点击新闻跳转到新闻页面
  openFindPage() {
    // this.nav.push('CmFindPage');
  }

  slideMoved() {
    console.log('执行吗');
    setTimeout(() => {
      // this.slider.startAutoplay();
    }, 1000);

  }
  openMaterialLocPage(uncheck, taskcheck, select) {
    if (!this.userData.getProjectId() || this.userData.getProjectId() == '0') {
      this.openProlist(null);
      return;
    }
    // this.nav.push('dailyFailureView');
  }

  doRefresh(refresher) {
    console.log('doRefresh...');
    this.onReload(refresher);
  }
  onView(object, slidingItem) {
    // 		 // this.nav.push(MtCheckRecordViewPage, {'id':object.id});
    if (slidingItem) {
      slidingItem.close();
    }
  }


  doCreate() {
    // 		// this.nav.push(MtCheckRecordEditPage, {'id':null});
  }
  onReload(event) {
    this.datas = [];
    this.pageNo = 1;
    // 		if(this.userData.getProjectId()){
    this.pagination(event);
    // 		}
  }
  openProductPage() {
    // this.nav.push('StoreProductPage');
  }
  openTaskPage(type, select, taskType) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId() && this.userData.getProjectId() != '0') {
        localStorage.setItem('isTask', '1');
        // this.nav.push('TasksPage', { 'type': type, 'taskType': taskType });
      } else {

        this.openProlist(select);
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  openCheckRecord(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId() && this.userData.getProjectId() != '0') {
        // this.nav.push('MtCheckRecordPage');
      } else {
        this.openProlist(select);
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }
  openUnImplementPage(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId() && this.userData.getProjectId() != '0') {
        // this.nav.push('UnImplementPage');
      } else {
        this.openProlist(select);
      }

    } else {
      // this.nav.push('NologinPage');
    }

  }
  openOflineTaskPage(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId() && this.userData.getProjectId() != '0') {
        // this.nav.push('OflineTasksPage');
      } else {
        this.openProlist(select);
      }
    } else {
      // this.nav.push('NologinPage');
    }

  }
  openReviewPage(select) {
    if (this.userData.isLogin()) {
      if (this.userData.getProjectId() && this.userData.getProjectId() != '0') {
        // this.nav.push('ReviewPage');
      } else {
        this.openProlist(select);
      }
    } else {
      // this.nav.push('NologinPage');
    }

  }
  loadProjectData(retval) {
    if (!retval.taskCount) {
      this.homeData.examineCount = 0;
    } else {
      if (this.homeData.examineCount > 99) {
        $('.audit-icon').css('margin-left', '0.4rem');
      }
    }
  }
  pagination(event) {
    let ptxt = 'null';
    if (this.userData.getProjectId()) {
      ptxt = this.userData.getProjectId();
      console.log('get projectid:' + ptxt);
    }
    if (!ptxt || ptxt === 'undefined') {
      ptxt = 'null';
    }
    try {
      this.homeService.getProjectData(ptxt)
        .subscribe(
          response => {
            this.homeNews = response.cmfind;
            this.loadProjectData(response);
          },
          err => {
            if (event) {
              event.target.complete();
            }
            throw err;
          },
          () => {
            console.log('pagination Complete');
            if (event) {
              event.target.complete();
            }
          }
        );
      // 		        });


    } catch (e) {
      if (!this.hasAlertNetwork) {
        this.hasAlertNetwork = true;
      }


    }
  }
  // 故障报修
  openMaterialLocPageAa(select) {

    if (this.userData.isLogin()) {
      if (this.userData.getProjectId() && this.userData.getProjectId() != '0') {
        // this.nav.push('malfunctionRepairList');
      } else {
        /*let toast = this.toastCtrl.create({
             message:'请选择项目',
             duration:1000
           });
         toast.present(toast);*/
        this.openProlist(select);
      }
    } else {
      // this.nav.push('NologinPage');
    }
    // this.nav.push(TasksEditPage)
  }
  openSys(select) {

    if (this.userData.isLogin()) {
      if (this.userData.getProjectId() && this.userData.getProjectId() != '0') {
        // this.nav.push('HomeCheckSystemPage');
      } else {
        /*let toast = this.toastCtrl.create({
             message:'请选择项目',
             duration:1000
           });
         toast.present(toast);*/
        this.openProlist(select);
      }
    } else {
      // this.nav.push('NologinPage');
    }
  }

  openScanView() {
    if (!this.userData.getProjectId() || this.userData.getProjectId() == '0') {
      this.openProlist(null);
      return;
    }
    // this.nav.push('ReScanViewPage', { 'isRegister': true });

  }

  async openProlist(e) {
    let alert = await this.alertCtrl.create({
      header: '提示',
      // subTitle: '请先登录消检通网址：<p>http:// app.xiaojiantong.com/xjt</p>完善项目信息',
      subHeader: '您暂无项目，前往pc端完善项目信息可使用更多功能。',
      buttons: ['确定']
    });
    alert.present();
  }
}
