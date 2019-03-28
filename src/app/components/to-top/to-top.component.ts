import { Component, Input, NgZone, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-to-top',
  templateUrl: './to-top.component.html',
  styleUrls: ['./to-top.component.scss'],
})
export class ToTopComponent implements OnInit  {

  @Input() config: ToTopConfig;
  @Input() total: number | string;

  content: IonContent;
  isScrolling = false;
  hidden = true;

  bottom = '1rem';
  right = '1rem';
  current = 0;

  constructor(private zone: NgZone) {
    this.total = 0;
  }

  ngOnInit() {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.content = this.config.content;
    this.bottom = this.config.bottom || this.bottom;
    this.right = this.config.right || this.right;
    if (this.content) {
    this.content.ionScroll.subscribe((event) => {
      this.zone.run(() => {
        this.hidden = this.isHidden(event);
        this.isScrolling = true;
        this.calculate(event);
      });
    });
    this.content.ionScrollEnd.subscribe(() => {
      this.zone.run(() => {
        this.isScrolling = false;
      });
    });
  }
  }

  calculate(event) {
    const scrollTop = event.detail.scrollTop;
    if (this.config.itemHeight === 0) {return; }
    this.current = Math.ceil(scrollTop / this.config.itemHeight);
  }

  isHidden(event) {
    return event.detail.scrollTop < 300;
  }

  toTop() {
    this.content.scrollToTop();
  }

}

export interface ToTopConfig {
  content: IonContent;
  itemHeight: number;
  right?: string;
  bottom?: string;
}
