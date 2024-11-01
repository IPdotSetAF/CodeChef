import { TestBed } from '@angular/core/testing';

import { MssqlScaffolderService } from './mssql-scaffolder.service';

describe('MssqlScaffoldService', () => {
  let service: MssqlScaffolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MssqlScaffolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
