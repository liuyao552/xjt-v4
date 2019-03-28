import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild('tabs') tabs: IonTabs;
  constructor(private router: Router) {

  }
  selectScan() {
    this.router.navigate(['/scan', {id: 1, name: 'liuyao'}]);
    // this.tabs.select('tab3');
  }
}
