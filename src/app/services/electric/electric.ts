import { Inject } from '@angular/core';
import { IAppConfig } from './../../config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

export interface Respose {
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class ElectricProvider {

  event;
  host = this.config.server + '/report/electricalFireEvent';
  // host = 'http://192.168.0.107:8080/xjt/report/electricalFireEvent'

  api = {
    faildList: this.host + '/listjsonEFAnomaly', // 异常清单
    dealFaild: this.host + '/workOrderProcessing', // 异常处理
    dealFaildDetail: this.host + '/processingDetails', // 异常处理详情
    engineeringList: this.host + '/listjsonEngineeringName', // 建筑列表
    engineeringSearch: this.host + '/searchByEngineeringName', // 建筑搜索
    equipmentList: this.host + '/listjsonElectricalEquipment', // 开关列表
    equipmentSearch: this.host + '/searchElectricalEquipment', // 开关搜索
    equipmentEcharts: this.host + '/listjsonElectricalFire', // 开关统计
  };
  constructor(
    public http: HttpClient,
    private config: IAppConfig,
    private toastCtrl: ToastController
  ) {

  }

  /**
   * 建筑列表获取
   * @param params 请求参数
   */
  getEngineeringList(params: EngineeringListParams): Observable<any> {
    const p = this.buildParams(params);
    const url = params.engineeringName ? this.api.engineeringSearch : this.api.engineeringList;
    return Observable.create(observer => {
      this.http.get(url + p).subscribe((res: Respose) => {
        if (this.event) { this.event.complete(); }
        if (res.status !== 200) { return; }
        observer.next(res);
        console.log(res);
      }, err => {
        if (this.event) { this.event.complete(); }
        this.errorDeal(err);
      }, () => {

      });
    });
  }

  /**
   * 设备开关列表获取
   * @param params 请求参数
   */
  getEquipmentList(params?: EquipmentListParams): Observable<any> {
    const p = this.buildParams(params);
    const url = params.equipmentName ? this.api.equipmentSearch : this.api.equipmentList;
    return Observable.create(observer => {
      this.http.get(url + p).subscribe((res: Respose) => {
        if (this.event) {
          this.event.complete();
        }
        if (res.status !== 200) { }
        observer.next(res);
      }, err => {
        if (this.event) {
          this.event.complete();
        }
        this.errorDeal(err);
      });
    });
  }

  /**
   * 开关统计
   * @param params 请求参数
   */
  getEchartsData(params: EquipmentDetailStatisticsParams): Observable<any> {
    const p = this.buildParams(params);
    const url = this.api.equipmentEcharts;
    return Observable.create(observer => {
      this.http.get(url + p).subscribe((res: Respose) => {
        if (res.status !== 200) { }
        observer.next(res);
      }, err => {
        this.errorDeal(err);
      });
    });
  }

  /**
   * 异常清单数据获取
   * @param params 请求参数
   */
  getFaildList(params?: FaildListParams): Observable<any> {
    const p = this.buildParams(params);
    return Observable.create(observer => {
      this.http.get(this.api.faildList + p).subscribe((res: Respose) => {
        if (res.status !== 200) { }
        observer.next(res);
      }, err => {
        observer.error();
        // this.errorDeal(err);
      }, () => {
        observer.complete();
      });
    });
  }

  /**
   * 工单处理
   * @param params 提交处理参数
   */
  dealFaild(params): Observable<any> {
    const p = this.buildParams(params);
    return Observable.create(observer => {
      this.http.get(this.api.dealFaild + p).subscribe((res: Respose) => {
        if (res.status !== 200) { }
        observer.next(res);
      }, err => this.errorDeal(err));
    });
  }

  /**
   * 处理详情
   * @param params 处理详情请求参数
   */
  dealFaildDetail(params): Observable<any> {
    const p = this.buildParams(params);
    return Observable.create(observer => {
      this.http.get(this.api.dealFaildDetail + p).subscribe((res: Respose) => {
        if (this.event) {
          this.event.complete();
        }
        if (res.status !== 200) { }
        observer.next(res);
      }, err => {
        if (this.event) {
          this.event.complete();
        }
        this.errorDeal(err);
      });
    });
  }

  /**
   * 构建参数
   * @param params 参数
   */
  buildParams(params: any): string {
    let p = '';
    for (const k in params) {
      if (params[k] || params[k] === 0) {
        p += `${k}=${encodeURIComponent(params[k])}&`;
      }
    }
    p = p.substring(0, p.length - 1);
    return '?' + p;
  }

  /**
   * 请求错误处理
   */
  errorDeal(err) {
    this.toastCtrl.create({ message: '连接错误，请稍后再试', duration: 1000 }).then(toast => toast.present());
  }

}


/**
 * 异常清单请求参数
 */
export interface FaildListParams {
  currentUserId: string;
  projectId: string;
  engineeringName: string;
  cloolectorId: string;
  abnormalType: 0 | 1 | 2 | 3;  // 0:正常  1：待处理  2：已处理  3：已忽略
  processingType: 0 | 1 | 2 | 3;  // 0:正常  1：电流  2：漏电  3：温度
}

/**
 * 工单处理请求参数
 */
export interface DealFaildParams {
  id: string;
  status: 0 | 1 | 2 | 3;    // 0:正常  1：待处理  2：已处理  3：已忽略
  text: string;
  type: 'leakageCurrent' | 'temperature';
}

/**
 * 建筑列表请求参数
 */
export interface EngineeringListParams {
  pageSize: number;
  page: number;
  projectId: string;
  engineeringName?: string; // 搜索参数（建筑名）
}

/**
 * 建筑开关列表请求参数
 */
export interface EquipmentListParams {
  pageSize: number;
  page: number;
  projectId: string;
  engineeringName: string;
  equipmentName: string;  // 搜索参数（开关名）
}

/**
 * 开关统计数据请求参数
 */
export interface EquipmentDetailStatisticsParams {
  projectId: string;
  engineeringName: string;
  cloolectorId: string;
  type: string;
}

export enum faildType {
  T = 'temperature',
  L = 'leakageCurrent'
}

/**
 * 返回结果类型----处理详情
 */
export interface DealDetail {
  disTimeStr: string;
  completeTime: string;
  text: string;
  cloolectorId: string;
  userName: string;
}

/**
 * 返回结果类型----异常清单
 */
export interface Faild {
  id: string;
  value: string;
  status: number;
  pointNO: string;
  text: string | null;
  completeTime: string | null;
  userId: string | null;
  happendTime: string;
}
