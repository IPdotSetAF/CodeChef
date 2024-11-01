import { Injectable } from '@angular/core';
import { MssqlService } from '../../services/mssql/mssql.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MssqlScaffolderService {

  constructor(private mssql: MssqlService) { }
  
}
