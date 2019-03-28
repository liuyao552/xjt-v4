import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryPage } from './battery.page';

describe('BatteryPage', () => {
  let component: BatteryPage;
  let fixture: ComponentFixture<BatteryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
