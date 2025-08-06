import { TestBed } from '@angular/core/testing';

import { SettingsStatusService } from './settings-status.service';

describe('SettingStatusService', () => {
  let service: SettingsStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
