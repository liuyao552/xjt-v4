import { TestBed } from '@angular/core/testing';

import { Tab5Service } from './tab5.service';

describe('Tab5Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Tab5Service = TestBed.get(Tab5Service);
    expect(service).toBeTruthy();
  });
});
