import { TestBed } from '@angular/core/testing';

import { Tab4Service } from './tab4.service';

describe('Tab4Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Tab4Service = TestBed.get(Tab4Service);
    expect(service).toBeTruthy();
  });
});
