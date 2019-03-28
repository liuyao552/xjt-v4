import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToTopPage } from './to-top.page';

describe('ToTopPage', () => {
  let component: ToTopPage;
  let fixture: ComponentFixture<ToTopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToTopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToTopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
