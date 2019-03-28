import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'navbar',
})
export class NavbarPipe implements PipeTransform {
  /**
   * 应用数字数组转为图片地址和应用名称
   */
  transform(value: number, name: string) {
    if (name === 'img') {
      switch (value) {
        case 0:
          return 'assets/img/solveMethod/cccf_icon.png';
        case 1:
          return 'assets/img/solveMethod/inspect_icon.png';
        case 2:
          return 'assets/img/solveMethod/maintenance_icon.png';
        case 3:
          return 'assets/img/solveMethod/detection_icon.png';
        case 4:
          return 'assets/img/solveMethod/fire_icon.png';
        case 5:
          return 'assets/img/solveMethod/fireAlarm_icon.png';
        case 6:
          return 'assets/img/solveMethod/electricFire_icon.png';
        case 7:
          return 'assets/img/messages/gas.png';
        case 8:
          return 'assets/img/smock.png';
        case 9:
          return 'assets/img/solveMethod/hydrant.png';
        case 10:
          return 'assets/img/solveMethod/watergage_icon.png';
        case 11:
          return 'assets/img/icons/waterLogging.png';
        case 12:
          return 'assets/img/solveMethod/scan_icon.png';
        case 13:
          return 'assets/img/solveMethod/compile_icon.png';
        case 14:
          return 'assets/img/solveMethod/checklist_icon.png';
        case 15:
          return 'assets/img/solveMethod/malfunctionRepair_icon.png';
        case 16:
          return 'assets/img/solveMethod/duty_record.png';
        case 17:
          return 'assets/img/solveMethod/offline_icon.png';
        case 18:
          return 'assets/img/solveMethod/audit_icon.png';
        case 19:
          return 'assets/img/solveMethod/report_icon.png';
        case 20:
          return 'img/solveMethod/veryEarly_icon.png';
        default:
          return '';
      }
    } else if (name === 'text') {
      switch (value) {
        case 0:
          return 'CCCF查询';
        case 1:
          return '巡查';
        case 2:
          return '保养';
        case 3:
          return '检测';
        case 4:
          return '火警主机';
        case 5:
          return '火眼警报';
        case 6:
          return '电气火灾';
        case 7:
          return '可燃气';
        case 8:
          return '智能烟感';
        case 9:
          return '消火栓';
        case 10:
          return '水压监测';
        case 11:
          return '水浸监测';
        case 12:
          return '设备登记';
        case 13:
          return '设备汇总';
        case 14:
          return '维保记录';
        case 15:
          return '设备报修';
        case 16:
          return '值班记录';
        case 17:
          return '离线巡检';
        case 18:
          return '审核';
        case 19:
          return '报表';
        case 20:
          return '极早期预警';
        default:
          return '其他';
      }
    } else if (name === 'icon') {
      switch (value) {
        case 0:
          return 'yuanquan';
        case 1:
          return 'chazhao';
        case 2:
          return 'bangzhushouce';
        case 3:
          return 'yingyongjianceqi';
        case 4:
          return 'zhuji';
        case 5:
          return 'huoyan';
        case 6:
          return 'dianqihuozaitubiao';
        case 7:
          return 'qitichuanganqi';
        case 8:
          return 'yanganchuanganqi';
        case 9:
          return 'xiaohuoshuan';
        case 10:
          return 'shuiya';
        case 11:
          return 'shuijin';
        case 12:
          return 'dengji';
        case 13:
          return 'huizong';
        case 14:
          return 'jilu';
        case 15:
          return 'shebeibaoxiu';
        case 16:
          return 'zhibanguanli';
        case 17:
          return 'feiji';
        case 18:
          return 'shenhe';
        case 19:
          return 'baobiao';
        default:
          return '其他';
      }
    } else if (name === 'appImg') {
      switch (value) {
        case 12:
          return 'assets/img/application/scan_icon.png';
        case 13:
          return 'assets/img/application/compile_icon.png';
        case 14:
          return 'assets/img/application/checklist_icon.png';
        case 15:
          return 'assets/img/application/malfunctionRepair_icon.png';
        case 16:
          return 'assets/img/application/duty_record.png';
        case 17:
          return 'assets/img/application/offline_icon.png';
        case 18:
          return 'assets/img/application/audit_icon.png';
        case 19:
          return 'assets/img/application/report_icon.png';
        default:
          return '';
      }
    }
  }
}
