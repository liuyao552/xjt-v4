import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the StatusPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, name: string) {
    if (name === 'hydrant') {
      // 1、低压  2、高夺   3、倾斜  4、浮球开启  5、浮球关闭   6、碰撞  7、其他  8、电量过低  9、开盖报警  10、取水报警  11、漏水报警  12、漏水传感器故障 13、撞击传感器故障
      switch (value) {
        case 1:
          return '越低限';
        case 2:
          return '越高限';
        case 3:
          return '倾斜';
        case 4:
          return '浮球开启';
        case 5:
          return '浮球关闭';
        case 6:
          return '碰撞';
        case 7:
          return '其他';
        case 8:
          return '电量过低';
        case 9:
          return '开盖报警';
        case 10:
          return '取水报警';
        case 11:
          return '漏水报警';
        case 12:
          return '漏水传感器故障';
        case 13:
          return '撞击传感器故障';
        default:
          return '其他';
      }
    } else if (name === 'hyHandle') {
      switch (value) {
        case 0:
          return '待处理';
        case 1:
          return '已忽略';
        case 2:
          return '已处理';
        default:
          return '其他';
      }
    } else if (name === 'gas') {
      switch (value) {
        case 1:
          return '浓度超标';
        case 2:
          return '静音';
        case 3:
          return '故障';
        case 4:
          return '低压';
        case 5:
          return '正常待机';
        case 6:
          return '电量过低';
        default:
          return '其他';
      }
    }
    return '暂无';
  }
}
