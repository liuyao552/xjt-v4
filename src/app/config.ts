// import { InjectionToken } from '@angular/core';

// export let APP_CONFIG = new InjectionToken('config');

export interface IAppConfig {
  locales: string;
  defaultLocale: string;
  locale: string;
  measurements: string;
  defaultMeasurement: string;
  measurement: string;
  server: string;
  dateFormat: string;
  dateTimeEditFormat: string;
  dateTimeViewFormat: string;
  dateTimeViewFormat1: string;
  dateTimeViewFormat2: string;
  dateTimePickFormat: string;
  translation: any;
  nav: any;
  version: any;
  appStoreUrl: any;
  appAndroidUrl: any;
}

export const AppConfig: IAppConfig = {
  locales: 'zh_CN|en_US',
  defaultLocale: 'zh_CN',
  locale: 'zh_CN',
  measurements: 'METRIC|INCH',
  defaultMeasurement: 'METRIC',
  measurement: 'METRIC',
  // server:'http://test.xiaojiantong.com:8080/xjt',
  // server:'http://120.24.40.190:8080/xjt',
  // server:'http://192.168.0.102:8080/xjt',
  // server: 'http://app.xiaojiantong.com/xjt',
  // server:'http://pa.xiaojiantong.com:8080/xjt',
   server: 'http://test2.xiaojiantong.com/xjt',
  //  server:'http://10.143.2.96:8080/xjt',
  dateFormat: 'YYYY-MM-DD',
  dateTimeEditFormat: 'YYYY-MM-DDTHH:mm:ss',
  dateTimeViewFormat: 'YYYY-MM-DD HH:mm:ss',
  dateTimeViewFormat1: 'YYYY/MM/DD HH:mm:ss',
  dateTimeViewFormat2: 'YYYY/MM/DD',
  dateTimePickFormat: 'YYYY-MM-DD',
  translation: null,
  nav: null,
  version: '3.6.5',
  appStoreUrl:
    'itunes.apple.com/us/app/xiao-jian-tong/id1163193447?l=zh&ls=1&mt=8',
  appAndroidUrl: 'http://app.xiaojiantong.com/xjtapp.apk'
};
