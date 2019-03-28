import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss'],
})
export class BatteryComponent implements OnInit {
  @Input() value = '100%';
  theme;
  low = 'rgb(219,40,17)';
  high = 'rgb(32,219,66)';
  middle = 'rgb(240,199,46)';
  constructor() { }

  ngOnInit() {
    this.batteryState();
  }

  batteryState() {
    const num = parseInt(this.value, 10);
    if (num > 60) {
      this.theme = this.high;
    } else if (num > 20 && num <= 60) {
      this.theme = this.middle;
    } else {
      this.theme = this.low;
    }
  }
}
