import { TestBed } from '@angular/core/testing';

import { JpushService } from './jpush.service';

describe('JpushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JpushService = TestBed.get(JpushService);
    expect(service).toBeTruthy();
  });
});
