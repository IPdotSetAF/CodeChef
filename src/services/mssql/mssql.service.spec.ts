import { TestBed } from '@angular/core/testing';

import { MssqlService } from './mssql.service';
import { provideHttpClient } from '@angular/common/http';

describe('MssqlService', () => {
  let service: MssqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ]
    });
    service = TestBed.inject(MssqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
