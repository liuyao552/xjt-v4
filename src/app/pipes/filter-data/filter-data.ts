import { Events } from '@ionic/angular';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterData',
})
export class FilterDataPipe implements PipeTransform {


  constructor(private event: Events) { }
  transform(list: any[], field: string, value: string) {
    if (!list || !list.length) {return []; }

    if (!field || !value || !value.toString()) {return list; }
    list = list.filter(item => item[field].toString().toUpperCase().indexOf(value.toUpperCase()) !== -1);
    if (list.length < 1) {
      this.event.publish('list:notEnough');
    }
    return list;
  }

}
