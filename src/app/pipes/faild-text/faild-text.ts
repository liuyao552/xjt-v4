import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'faildText',
})
export class FaildTextPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {return; }
    let reason = '';
    const type = value.substring(0, 1).toUpperCase();
    const line = value.substr(value.indexOf('NO') + 2);
    switch (type) {
      case 'L':
        reason = `线缆${line}漏电值 `;
        break;
      case 'T':
        reason = `线缆${line}温度值 `;
        break;
      default:
        break;
    }
    return reason;
  }
}
