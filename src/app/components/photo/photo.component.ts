import { Component, NgZone, Input, Inject } from '@angular/core';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserData } from '../../services/user-data';
import { PhotoService } from './photo.service';
/**
 * postPhoto(id:string) 上传图片
 * deleteImg() 删除，调用接口删除服务器图片
 *
 */
@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent {
  @Input() fdAddress: string; // 地址，用于水印
  @Input() beforeimg: any[] = []; // 服务器已有图片数组
  @Input() noPermissions: boolean; // 是否没有拍照权限
  @Input() maxLength = 100; // 是否没有拍照权限
  projectName: string;
  dataUrlArr: any[] = [];
  images: any[] = [];
  clarity: string;
  projectId: string;
  id: string;
  deleteId: any[];

  constructor(
    private alertCtrl: AlertController,
    private ngzone: NgZone,
    private modalController: ModalController,
    private file: File,
    private camera: Camera,
    private toastCtrl: ToastController,
    private platform: Platform,
    private userData: UserData,
    private photoService: PhotoService
  ) {
    this.clarity = localStorage.getItem('clarityType') || '0.8';
    this.projectName = this.userData.getHomeTitle();
    this.deleteId = [];

  }

  // 打开相机
  //   openCamera(){
  // 	  this.camera.getPicture({correctOrientation:true}).then(
  // 			    res => {

  // 			    		this.compress(res);

  // 			    },
  // 			    err => {
  // 			    	console.error('Error taking picture', err);
  // 			    	if(err==20 || err=='20'){
  // 			    		let alert = this.alertCtrl.create({
  // 					  	      title: '提示',
  // 					  	      message:('无法获取摄像头数据，请检查是否已经打开摄像头权限'),
  // 					  	      buttons: ['确定']
  // 					  	  });
  // 					  	  alert.present();
  // 			    	}
  // 			    	}
  // 			  );

  //   }

  private openCamera() {
    if (!this.fdAddress) {
      this.fdAddress = '';
    }
    let limitLength;
    if (this.platform.is('android')) {
      limitLength = 59;
    } else {
      limitLength = 47;
    }
    const quality = +this.clarity * 100; // 系统默认为50
    const multiplSize = 2;
    const $this = this;
    const infostr = this.projectName + '  ' + this.fdAddress;
    const tl = this.cutString(infostr, limitLength + '');
    let dateInfo1 = '';
    if (tl === infostr.length) {
      dateInfo1 = infostr;
    } else {
      // dateInfo1 = this.getTrueLength(infostr) > 68 ? infostr.replace(infostr.substring(tl), '… ') : infostr;
      dateInfo1 =
        this.getTrueLength(infostr) > limitLength - 2
          ? infostr.substr(0, tl) + '… '
          : infostr;
    }
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    // targetWidth: screen.width * multiplSize, // 设置了宽高会降低图片质量
    // targetHeight: screen.height * multiplSize,
    // correctOrientation: true,
    // quality: quality,
    // shadeText: this.getCurrentTimeStr() + '|' + dateInfo1, // 两行水印
    // compressMultiple: 6, //6倍压缩 即返回的小图为大图的1/6
    // cameraType: 1
    this.camera.getPicture(options).then((imageData) => {

     }, (err) => {
      // Handle error
     });
    this.camera
      .getPicture()
      .then(
        res => {
          this.images.push({ commit: false, src: res });
        },
        err => {
          console.error('Error taking picture', err);
          $this.camera.cleanup();
          if (err === 20 || err === '20') {
            this.alertCtrl.create({
              header: '提示',
              message: '无法获取摄像头数据，请检查是否已经打开摄像头权限',
              buttons: ['确定']
            }).then(alert => alert.present());
          } else {
            // let alert = this.alertCtrl.create({
            // 	title: '提示',
            // 	message: ('发生了错误,err:' + err),
            // 	buttons: ['确定']
            // });
            // alert.present();
          }
        }
      );
  }

  // 获取当前时间
  private getCurrentTimeStr() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minute =
      date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    const second =
      date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    return (
      year + '年' +
      month + '月' +
      day + '日 ' +
      hour + ':' +
      minute + ':' +
      second
    );
  }

  // 加载图片并添加水印
  private compress(res) {
    const img = new Image(),
      maxH = 1200;
    img.onload = () => {
      const cvs = document.createElement('canvas'),
        ctx = cvs.getContext('2d');
      if (img.height > maxH) {
        img.width *= maxH / img.height;
        img.height = maxH;
      }
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
      const minute =
        date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
        const second =
        date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
        const dateInfo =
        year + '年' +
        month + '月' +
        day + '日 ' +
        hour + ':' +
        minute + ':' +
        second +
        '\n';
        let dateInfo1 = this.projectName + '\n' + this.fdAddress;
      // 根据水印文字长度确定水印高度
      cvs.height =
        this.getTrueLength(dateInfo1) > 98
          ? img.height + 130
          : this.getTrueLength(dateInfo1) > 50
          ? img.height + 100
          : this.getTrueLength(dateInfo1) > 0
          ? img.height + 70
          : img.height + 70;
      cvs.width = img.width;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.font = '18pt "Microsoft YaHei"';
      ctx.fillStyle = 'rgba(255,206,67,1)'; // 字体颜色
      ctx.fillText(dateInfo, 10, img.height + 35);
      const initHeight = img.height + 35; // 绘制字体距离canvas顶部初始的高度
      const lineheight = 28; // 水印文字行高
      // 水印内容换行
      for (let i = 1; this.getTrueLength(dateInfo1) > 0 && i < 4; i++) {
        const tl = this.cutString(dateInfo1, '50');
        // 水印内容过多时省略
        if (i === 3) {
          this.getTrueLength(dateInfo1) > 48
            ? ctx.fillText(
                dateInfo1.replace(dateInfo1.charAt(tl), '… ').split(' ')[0],
                10,
                i * lineheight + initHeight
              )
            : ctx.fillText(
                dateInfo1.substr(0, tl).replace(/^\s+|\s+$/, ''),
                15,
                i * lineheight + initHeight
              );
          dateInfo1 =
            this.getTrueLength(dateInfo1) > 48
              ? dateInfo1.replace(dateInfo1.substring(tl), '… ')
              : dateInfo1.substr(tl);
        } else {
          ctx.fillText(
            dateInfo1.substr(0, tl).replace(/^\s+|\s+$/, ''),
            10,
            i * lineheight + initHeight
          );
          dateInfo1 = dateInfo1.substr(tl);
        }
      }
      const dataUrl = cvs.toDataURL('image/jpeg', +this.clarity);
      this.dataUrlArr.push({
        commit: false,
        img: cvs.toDataURL('image/jpeg', +this.clarity)
      });
      // this.dataUrlArrhigh.push({commit:false,img:cvs.toDataURL('image/jpeg', 0.9)});
      const imageObj = { src: dataUrl, percent: 0 };
      // this.images.push(imageObj);
      this.ngzone.run(() => {
        this.images.push(imageObj);
      });
    };
    img.src = res;
  }

  // 按字节长度截取字符串，返回substr截取位置
  private cutString(str, leng) {
    const len = str.length;
    let tlen = len,
      nlen = 0;
    for (let x = 0; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        if (nlen + 2 < leng) {
          nlen += 2;
        } else {
          tlen = x;
          break;
        }
      } else {
        if (nlen + 1 < leng) {
          nlen += 1;
        } else {
          tlen = x;
          break;
        }
      }
    }
    return tlen;
  }

  // 选取本地图片
  private fileChange($event) {
    const reader = new FileReader();
    const $this_a = this;
    reader.onload = function(e) {
      $this_a.compress(this.result);
    };
    reader.readAsDataURL($event.target.files[0]);
  }

  // 获取字符串的真实长度（字节长度）
  private getTrueLength(str) {
    const len = str.length;
    let truelen = 0;
    for (let x = 0; x < len; x++) {
      if (str.charCodeAt(x) > 128) {
        truelen += 2;
      } else {
        truelen += 1;
      }
    }
    return truelen;
  }

  /**
   *
   * @param imgobj 上传图片
   */
  private sendPic(imgobj, index) {
    const dataUrl = imgobj.src; // 这里的dataUrl其实是个文件路径
    const tempArray = dataUrl.split('/'); // 表示转义
    let filePath = 'file://'; // 形如：file:///storage/emulated/... ，否则访问不到文件，提示：{'code':5,'message':'ENCODING_ERR'}
    const fileName = tempArray[tempArray.length - 1];
    for (let i = 0; i < tempArray.length - 1; i++) {
      filePath += tempArray[i] + '/';
    }

    return new Promise((resolve, reject) => {
      const imageObj = { src: dataUrl, percent: 0 };
      this.file.readAsDataURL(filePath, fileName).then(
        (result) => {
          const imageBlob = this.userData.getBlobFromBase64(result);
          const form = document.forms.namedItem('fileinfo');
          const oMyForm = new FormData(form);

          oMyForm.append('file', imageBlob, '现场图片.jpg');

          const oReq = new XMLHttpRequest();
          oReq.open(
            'POST',
            this.userData.getUrl(
              '/file/attachment/upload?oid=' +
                this.id +
                '&s=proj&key=attachment&public=true&proj=' +
                this.projectId
            )
          );
          oReq.setRequestHeader(
            'Authorization',
            'Bearer ' + this.userData.getUser().token
          );
          oReq.setRequestHeader('Accept', '*/*');
          oReq.onreadystatechange = () => {
            if (oReq.readyState === 4 && oReq.status === 200) {
              console.log(oReq.responseText);
              this.images[index].commit = true;
              resolve();
            }
            if (oReq.readyState === 4 && oReq.status !== 200) {
              console.log(oReq.responseText);
              console.log('图片提交失败');
              this.toastCtrl
                .create({ message: '网络连接错误，请稍后重试', duration: 1500 })
                .then(toast => toast.present());
              // imgobj.commit = true;
              reject('图片提交失败1');
              // throw new Error('报错了');
            }
          };

          (oReq.upload || oReq).addEventListener('progress', (oEvent: any) => {
            if (oEvent.lengthComputable) {
              this.ngzone.run(() => {
                const percentComplete = oEvent.loaded / oEvent.total;
                imageObj.percent = Math.round(percentComplete * 100);
              });
            } else {
              // Unable to compute progress information since the total size is unknown
            }
          });
          (oReq.upload || oReq).addEventListener('load', oEvent => {
            imageObj.percent = null;
          });
          oReq.send(oMyForm);
        },
        function(error) {
          console.log('read file error:' + JSON.stringify(error));
          alert('data....' + JSON.stringify(error));
        }
      );
    });
  }

  /**
   * 提交图片
   * 父组件通过调用此方法提交图片
   */
  public postPhoto(id) {
    if (this.deleteId.length > 0) {
      this.deleteImg();
    }
    let promisesimg;
    this.id = id;
    return new Promise((resolve, reject) => {
      promisesimg = this.dataUrlArr.map((img, index) => {
        if (!img.commit) {
          return this.sendPic(img, index);
        }
      });
      Promise.all(promisesimg)
        .then(function(posts) {
          console.log('图片全部上传成功');
          resolve();
        })
        .catch(function(reason) {
          // ...
          reject();
        });
    });
  }
  /**
   * 获取图片长度
   */
  public getPicLength() {
    return this.dataUrlArr.length + this.beforeimg.length;
  }

  /**
   * 置空
   */
  clearImg() {
    this.dataUrlArr = [];
    this.images = [];
  }
  /**
   * 预览
   */
  private async preview(index, n) {
    if (!this.beforeimg) {
      this.beforeimg = [];
    }
    if (1 === n) {
      index += this.beforeimg.length;
    }
    // const modal = await this.modalController.create({
    //   component: PreviewPage,
    //   componentProps: {
    //     img: this.beforeimg.concat(this.dataUrlArr),
    //     idx: index
    //   }
    // });
    // await modal.present();

  }
  /**
   * 本地删除服务器已有图片
   */
  private cancelImgArr(img, index) {
    this.beforeimg.splice(index, 1);
    this.deleteId.push(img.id);
  }
  /**
   * 本地删除拍照的图片
   * @param index 角标
   */
  private cancelImg(index: number) {
    this.images.splice(index, 1);
    this.dataUrlArr.splice(index, 1);
  }

  /**
   * 删除图片，调用了接口，是服务器上的删除
   */
  private deleteImg() {
    for (let i = 0; i < this.deleteId.length; i++) {
      this.photoService.deleteImg(this.deleteId[i])
      .subscribe(
        response => {
        if (response.success) {
        }
      });
    }
  }

  /**
   * 提示需要位置信息
   */
  private tipPermissions() {
    this.alertCtrl.create({
      header: '提示',
      subHeader: '请先完善位置信息',
      buttons: ['确定']
    }).then(alert => alert.present());
  }

  /**
   * 清除缓存文件，离开页面时请调用
   */
  public clearCacheImageFromDisk() {
    this.camera.cleanup();
  }
}
