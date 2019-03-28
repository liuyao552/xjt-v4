import { Component, Inject, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import * as $ from 'jquery';
import { ToastController, Events } from '@ionic/angular';
import { DragService } from './drag.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.scss'],
})

export class DragComponent implements OnChanges {
  @Input() datas: number[] = []; //  应用数组
  @Output() changeApp = new EventEmitter<boolean>();
  dragT: any;
  dragL: any;
  dragW: any;
  dragH: any;
  // 定义开始移动位置
  startX: any;
  startY: any;
  // 重置移动参数
  moveX: number;
  moveY: number;
  nowX: any;
  nowY: any;
  tarEle: any;
  tarL: any;
  tarW: any;
  tarT: any;
  tarH: any;
  top: any;
  left: any;
  topSave: any;
  leftSave: any;
  rowNum: number; //  行数
  colNum: number; //  列数
  range: number; //  误差范围
  index: number;
  tempTar: any;
  currentRow: number;
  projectId: string;
  tempDatas: any;

  constructor(
    private toastCtrl: ToastController,
    private dragService: DragService,
    private location: Location,
    public events: Events) {
    console.log('Hello DragComponent Component');
    this.rowNum = 3;
    this.colNum = 4;
    this.range = 10;
  }

  ngOnChanges(changes) {
    for (const propName of changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (this.datas) {
        this.currentRow = Math.ceil(this.datas.length / 4);
        this.events.publish('currentRow', this.currentRow);
        this.tempDatas = this.datas.concat([]);
      } else {
        this.currentRow = 0;
        this.events.publish('currentRow', this.currentRow);
      }

    }

  }

  private start(e) {
    // console.log(e);
    // e.preventDefault();
    // e.stopPropagation();
    let tar = e.target;
    if (tar.className.indexOf('drag-item') === -1) {
      tar = tar.parentElement;
    }
    // 执行定义在拖动开始时须执行的函数， 参数为即将拖动的元素
    // this.opts.onStart(tar);
    // 初始化拖动元素的位置信息；
    this.dragT = tar.offsetTop;
    this.dragL = tar.offsetLeft;
    this.dragW = tar.offsetWidth || tar.clientWidth;
    this.dragH = tar.offsetHeight || tar.clientHeight;
    // 定义开始移动位置
    this.startX = e.pageX || e.touches[0].pageX;
    this.startY = e.pageY || e.touches[0].pageY;
    //  重置移动参数
    this.moveX = this.moveY = 0;
  }
  private move(e) {
    //  e.preventDefault();
    //  e.stopPropagation();
    //  console.log(e);
    let tar = e.target;
    if (tar.className.indexOf('drag-item') === -1) {
      tar = tar.parentElement;
    }
    //  this.opts.onMove(tar);
    this.nowX = e.pageX || e.touches[0].pageX;
    this.nowY = e.pageY || e.touches[0].pageY;

    //  计算目标元素需移动的距离
    this.moveX = this.nowX - this.startX;
    this.moveY = this.nowY - this.startY;

    //  检测是否越界，并调整
    //  this.checkOver(this.moveX, this.moveY);

    //  进行拖动元素移动操作
    this.setMove(tar);


    //  检测是否落入目标位置
    this.checkPos('move', tar);
  }
  private end(e) {
    //  目标区域的视觉变化
    //  this.tarEle.style.cssText = 'opacity: .5;'
    //  检测最终位置
    this.left = 0;
    this.top = 0;
    this.checkPos('end', e.target);
  }
  private setMove(e, type?) {
    if (e.className.indexOf('drag-item') === -1) {
      e = e.parentElement;
    }
    const x = this.moveX || 0,
      y = this.moveY || 0;
    if (type === 'reset') {
      $('#drag-ul li.temp').remove();
      e.style.cssText = '';
      return;
    }
    this.left = this.left || e.offsetLeft;
    this.top = this.top || e.offsetTop;
    // e.style.cssText += 'position: absolute;-webkit-transform: translate(' + x + 'px,' + y + 'px);
    // -moz-transform: translate(' + x + 'px,' + y + 'px);-o-transform: translate(' + x + 'px,' + y + 'px);
    // -ms-transform: translate(' + x + 'px,' + y + 'px);z-index:9;';
    e.style.cssText += 'transition:all 0s;position: absolute; left:' + (this.left + x) + 'px;top:' + (this.top + y) + 'px;z-index:8;';
  }

  private checkOver(moveX, moveY) {
    // 检测元素是否越界
    const aW = 320,
      // var aW = doc.body.clientWidth || window.screen.width,
      // aH = doc.body.clientHeight || window.screen.height,
      aH = 300,
      x = this.dragL + moveX,
      y = this.dragT + moveY,
      w = this.dragL + this.dragW + moveX,
      h = this.dragT + this.dragH + moveY;
    if (x < 0) {
      this.moveX = - this.dragL;
    } else if (w > aW) {
      this.moveX = aW - this.dragL - this.dragW;
    }
    if (y < 0) {
      this.moveY = - this.dragT;
    } else if (h > aH) {
      this.moveY = aH - this.dragT - this.dragH;
    }
  }

  private checkPos(type, e) {

    if (this.checkX(e, this.colNum) && this.checkY(e, this.rowNum)) {
      // 进入目标区域
      const col = this.checkX(e, this.colNum);
      const row = this.checkY(e, this.rowNum);
      const index = (row - 1) * this.colNum + col;
      if (this.index !== index) {
        // $('#drag-ul li.temp').remove();
        if (this.index < index) {
          $(e).insertAfter($('#drag-ul li').eq(index - 1));
        } else {
          $(e).insertBefore($('#drag-ul li').eq(index - 1));
        }
        const datasLength = this.tempDatas.length;
        if (this.index && this.index < datasLength && index < datasLength) {
          let temp;
          temp = this.tempDatas[index - 1];
          this.tempDatas[index - 1] = this.tempDatas[this.index - 1];
          this.tempDatas[this.index - 1] = temp;
        }
        // $('#drag-ul li').eq(index - 1).before('<li class='temp'><div class='drag-item'></div></li>');
        // $(e.parentElement).detach();
      }
      this.index = index;
      if (type === 'move') {
        // 在移动过程中，进入目标区域
        // this.opts.onMoveIn(this.tarEle);

      } else {
        // 在拖动结束时进入目标区域
        e.style.cssText = 'transition: all 0.1s ease-in;';

        // this.opts.onEnd(e);
      }
    } else {
      // this.tarEle.style.cssText = 'opacity: .5;'
      if (type === 'end') {
        this.resetFun(e);
      }
    }


    //  // 判断拖动元素是否到达目标位置，判断方式更具情况而定，此处判断的依据是：touch事件位置判断，即结束时touch的位置是否在目标区域位置
    //  if (this.nowX > this.tarL && this.nowX < this.tarL + this.tarW && this.nowY > this.tarT && this.nowY < this.tarT + this.tarH) {
    //    // 进入目标区域
    //    if (type === 'move') {
    //      // 在移动过程中，进入目标区域
    //      // this.opts.onMoveIn(this.tarEle);
    //    } else {
    //      // 在拖动结束时进入目标区域
    //      // this.opts.onEnd(e);
    //    }
    //  } else {
    //    // this.tarEle.style.cssText = 'opacity: .5;'
    //    if (type === 'end') {
    //      this.resetFun(e);
    //    }
    //  }
  }
  /**
   *
   * @param n 列数
   */
  private checkX(e, n: number) {
    const clientWidth = document.body.clientWidth;
    for (let i = 0; i < n; i++) {
      const limit = clientWidth * (0.04 + i * 0.24);
      if (e.offsetLeft > limit - this.range && e.offsetLeft < limit + this.range) {
        return i + 1;
      }
    }
    return 0;
  }
  /**
   *
   * @param e dom对象
   * @param n 行数
   */
  private checkY(e, n: number) {
    for (let i = 0; i < n; i++) {
      const limit = 47 + 69 * i;
      if (e.offsetTop > limit - 10 && e.offsetTop < limit + 10) {
        return i + 1;
      }
    }
    return 0;
    //  if (e.offsetTop > 46 && e.offsetTop < 107
    //    || e.offsetTop > 115 && e.offsetTop < 116 + 60
    //    || e.offsetTop > clientWidth * 0.51 && e.offsetTop < clientWidth * 0.53
    //    || e.offsetTop > clientWidth * 0.75 && e.offsetTop < clientWidth * 0.77) {// 28 52 76
    //    return true;
    //  }
  }

  private resetFun(e) {
    this.moveX = this.moveY = 0;
    this.startX = this.startY = 0;
    this.nowY = this.top;
    this.nowX = this.left;
    // e.innerHTML = 'drag' + e.dataset.num;
    this.setMove(e, 'reset');
  }

  /**
   * 添加应用
   */
  public async addItem(n) {
    if (this.datas.length < 12) {
      this.datas.push(n);
      this.tempDatas.push(n);
      this.currentRow = Math.ceil(this.datas.length / 4);
      this.events.publish('currentRow', this.currentRow);
      this.changeApp.emit();
      return true;
    } else {
      const toast =  await this.toastCtrl.create({
        message: '最多添加12个应用',
        duration: 1000,
        position: 'middle'
      });
      toast.present();
    }
  }

  /**
   * 删除应用
   */
  async deleteItem(data) {
    if (this.datas.length < 2) {
     const toast =  await this.toastCtrl.create({
        message: '最少保留1个应用',
        duration: 1000,
        position: 'middle'
      });
      toast.present();
      return;
    }
    for (let i = 0; i < this.datas.length; i++) {
      if (data === this.datas[i]) {
        this.datas.splice(i, 1);
        this.tempDatas.splice(i, 1);
        this.currentRow = Math.ceil(this.datas.length / 4);
        this.events.publish('currentRow', this.currentRow);
        this.changeApp.emit();
        return true;
      }
    }
  }

  /**
   * 提交  添加删除
   */
  public submit(nav) {
    const parm = this.tempDatas.join(',');
    this.dragService.getNavList(parm)
      .subscribe(
        async response => {
          if (response.msg === 'success') {
            const toast = await this.toastCtrl.create({
              message: '提交成功',
              duration: 1000,
              position: 'middle'
            });
            this.location.back();
          }
        }, err => {
          throw err;
        }
      );
  }

}
