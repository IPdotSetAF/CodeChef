import { TestBed } from '@angular/core/testing';

import { MssqlService } from './mssql.service';

describe('MssqlService', () => {
  let service: MssqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MssqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
