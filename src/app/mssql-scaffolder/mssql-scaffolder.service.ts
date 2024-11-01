import { Injectable } from '@angular/core';
import { MssqlService } from '../../services/mssql/mssql.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MssqlScaffolderService {

  constructor(private mssql: MssqlService) { }

  
  // public getStoredProcedureParams(spName: string, schema: string = 'dbo'): Observable<any> {
  //   // const result = await this.pool?.request().execute(`[${schema}].[${spName}]`);
  //   // return result.parameters;
  // }

  // async getSchemaList(): Observable<any> {
  //   // const result = await this.pool?.request().query('SELECT * FROM information_schema.schemata');
  //   // return result.recordset;
  // }
}
