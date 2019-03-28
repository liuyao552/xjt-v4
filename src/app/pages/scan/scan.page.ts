import { ModalController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { UserData } from '../../services/user-data';
import * as $ from 'jquery';
import { BdageProvider } from '../../services/bdage/bdage';
import { ScanService } from './scan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})

export class ScanPage implements OnInit {
  scaning: boolean;
  islight: boolean;
  scanurl: string;
  projectId: any;
  isback: boolean;
  count: number;
  tabNum: any;
  isRegister: string;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private qrScanner: QRScanner,
    private userData: UserData,
    private toastCtrl: ToastController,
    private bdageProvider: BdageProvider,
    private scanService: ScanService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.scaning = false;
    this.islight = false;
    this.isback = true;
    this.count = 0;
    this.projectId = this.userData.getProjectId();
  }

  ngOnInit() {
     this.isRegister = this.route.snapshot.paramMap.get('isRegister');
  }

  ionViewWillEnter() {
    // $('.tabbar.show-tabbar').css('opacity', '0');
    localStorage.setItem('scanable', 'false');
    this.scan();
  }
  ionViewDidEnter() {
    this.bdageProvider.loadMessageCount();
   // $('ion-app').css('background-color', 'transparent');
   // $('ion-content').css('background-color', 'transparent');
    this.scaning = true;
  }
  ionViewWillLeave() {
    this.qrScanner.disableLight();
    if (this.isback) {
      // $('.tabbar.show-tabbar').css('opacity', '1');
    }
    this.qrScanner.hide(); // hide camera preview
    this.qrScanner.destroy();
  }
  ionViewDidLeave() {
    // $('.tabbar.show-tabbar').css('opacity', '1');
    // $('ion-app').css('background-color', '#fff');
    // $('ion-content').css('background-color', '#fff');
    localStorage.setItem('scanable', 'true');
    if (this.tabNum > 999) {
      $('.tab-badge').html('999+');
    }
    if (this.tabNum === '0') {
      $('.tab-badge').html('');
    } else {
      $('.tab-badge').html(this.tabNum);
    }
  }
  // 扫描
  scan() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          console.log('camera permission was granted');
          // start scanning
          const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
            console.log('Scanned something', text);
            const toast =  await this.toastCtrl
            .create({
              message: text,
              duration: 6000
            });
            toast.present();
            this.scanurl = text;
            this.start(text);
            this.isback = false;
            scanSub.unsubscribe(); // stop scanning
            console.log('stop scanning');
          });
          // show camera preview
          console.log('show camera preview');
          this.qrScanner.show();
          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => {
        console.log('Error is', e);
        console.log(typeof e);
        if (e.code === 1 || e.name === 'CAMERA_ACCESS_DENIED') {
          if (this.platform.is('ios')) {
            this.userData.alertError(
              '请在iPhone的“设置-隐私-相机”选项中，允许消检通访问你的相机。',
              null
            );
          } else {
            this.userData.alertError(
              '请允许消检通访问你的相机。',
              null
            );
          }
        }
      });
  }
  // 跳转
  private start(url) {
    if (!url || (url.indexOf('xiaojiantong') < 0 && url.indexOf('lable') < 0)) {
      this.userData.alertError('不可辨识的二维码,请重新扫码.', null);
      return;
    }
    if (url.indexOf('http://114.112.48.163') > -1) {
      url = url.replace('114.112.48.163', 'lxxx.cccf.com.cn');
      this.getData(url);
    } else if (url.indexOf('lxxx.cccf.com.cn') > -1) {
      this.getData(url);
    } else if (url.indexOf('www.cccf.com.cn') > -1) {
      this.getData(url);
    } else if (url.indexOf('lableFind.jsp') > -1) {
      this.getData(url);
    } else {
      this.scanService.getQrcodeData(url)
        .subscribe(
          response => {
            let scanUrl = url;
            localStorage.setItem('qrcode', '0');
            if (!url.startsWith('http')) {
              scanUrl = this.userData.getUrl('/mt/mtMaterialLoc/vqr/') + url;
            }
            const idx = url.indexOf('/mt/mtMaterialLoc/vqr/');
            if (idx > 0) {
              const qrcode = url.substring(idx + 22);
              localStorage.setItem('qrcode', qrcode);
            }

            if (response.flag === 1) {
              if (true) { // this.params.data.isRegister
                // this.nav.push('scanSelect', {
                //   scannedText: response.fdQr,
                //   isRegister: true
                // });
              } else {
                // this.nav.push('scanSelect', {
                //   scannedText: response.fdQr
                // });
              }
            } else {
              // this.nav.push('ScanResultPage', {
              //   scannedText: url,
              //   scan: true
              // });
            }
          },
          err => {
             throw err;
          }
        );
    }
  }
  // 手电筒
  enableLight() {
    if (!this.islight) {
      this.qrScanner.enableLight();
    } else {
      this.qrScanner.disableLight();
    }
    this.islight = !this.islight;
  }
  // 手输二维码
  inputQr() {
    // let profileModal = this.modalCtrl.create('ScanViewPage');
    // profileModal.present();
  }

  back() {
    this.location.back();
  }
  async getData(codeurl) {
    const lableCode = codeurl.split('=')[1];
    const loading = await this.loadingCtrl.create({
      message: '正在处理，请稍候...'
    });
    loading.present();
    this.scanService.getLabelInfo(lableCode)
    .subscribe(
      async (res: any) => {
        loading.dismiss();
        const result = JSON.parse(res.text());
        const data = result.ccfProduct;
        const state = result.state ? result.state : false;
        if (data) {
          if (data.length > 1) {
            // this.nav.push('DeviceListPage', {
            //   result: data,
            //   state: state,
            //   scan: true
            // });
          } else {
            // this.nav.push('scanPages', {
            //   result: data,
            //   state: state,
            //   scan: true
            // });
          }
          // this.go(this.nv, 'EquipmentPage', { result: data, state: state, scan: true })
        } else {
         const toast =  await this.toastCtrl
            .create({
              message: '没有查询到相关信息',
              duration: 1000
            })
            toast.present();
        }
      },
      err => {
        loading.dismiss();
        throw err;
      }
    );
  }
}
