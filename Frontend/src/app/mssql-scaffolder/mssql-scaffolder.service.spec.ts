import { TestBed } from '@angular/core/testing';

import { MssqlScaffolderService } from './mssql-scaffolder.service';
import { provideHttpClient } from '@angular/common/http';

describe('MssqlScaffoldService', () => {
  let service: MssqlScaffolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient()
      ]
    });
    service = TestBed.inject(MssqlScaffolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
