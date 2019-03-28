import { Injectable, Inject } from '@angular/core';
import { UserData } from '../user-data';
import { HttpClient } from '@angular/common/http';
// import { Badge } from '@ionic-native/badge/ngx';

export interface BadgeRes {
  sum: string | number;
}

// import * as $ from 'jquery';

/**
 * 获取角标数
 */

@Injectable({
  providedIn: 'root'
})
export class BdageProvider {
  constructor(
    // private badge: Badge,
    // private http: HttpClient
  ) {
    console.log('Hello BdageProvider Provider');
  }

  /**
   * 获取消息角标
   */
  public loadMessageCount(): void {
    // const url =
    //   this.config.server +
    //   '/messageCenter/message/countMessage1?projectId=' +
    //   this.userData.getProjectId() +
    //   '&typeArr=-1;2;3;4;-2;-3;-4;5;6;7;8;9;10';
    // this.http.get(url).subscribe(
    //   response => {
    //     let num = response;
    //     if (num > 999) {
    //       num = '999+';
    //     }
    //     if (num === '0') {
    //       // $('.tab-badge').html('')
    //     } else {
    //       // $('.tab-badge').html(num)
    //     }
    //     console.log('消息' + num);
    //   },
    //   err => {
    //     console.log('catch loadmessage');
    //     throw err;
    //   },
    //   () => {
    //     console.log('load messageCount Complete');
    //   }
    // );
  }

  loadBdage() {
    // if (this.userData.getUser() && this.userData.getProjectId()) {
    //   const url =
    //     this.config.server +
    //     '/project/base/pbBaseProject/getSumCount1/' +
    //     this.userData.getProjectId();
    //   this.http.get(url).subscribe(
    //     (response: BadgeRes) => {
    //       this.badge.set(+response.sum);
    //     },
    //     err => {
    //       console.log('catch loadmessage');
    //     },
    //     () => {
    //       console.log('load messageCount Complete');
    //     }
    //   );
    // }
  }
}
