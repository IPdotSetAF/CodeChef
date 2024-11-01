import { Injectable } from '@angular/core';
import { MssqlService } from '../../services/mssql/mssql.service';
import { Observable } from 'rxjs';
import { GetColumnsResponse, GetSPParametersResponse, GetSPReturnColumnsResponse } from './mssql-scaffolder.model';
import { ErrorResponse } from '../../services/mssql/mssql.model';

@Injectable({
  providedIn: 'root'
})
export class MssqlScaffolderService {

  constructor(private mssql: MssqlService) { }

  // 5. Get all columns and their types from a table
  getColumns(connection_id: string, dbName: string, tableName: string): Observable<GetColumnsResponse[] | ErrorResponse> {
    const query = `
      SELECT 
        c.name AS 'ColumnName',
        t.Name AS 'DataType',
        c.max_length AS 'MaxLength',
        c.precision,
        c.scale,
        c.is_nullable,
        ISNULL(i.is_primary_key, 0) AS 'PrimaryKey'
      FROM sys.columns c
      INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
      LEFT OUTER JOIN sys.index_columns ic ON ic.object_id = c.object_id AND ic.column_id = c.column_id
      LEFT OUTER JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
      WHERE c.object_id = OBJECT_ID('${tableName}');
    `;
    return this.mssql.executeQuery<GetColumnsResponse>(connection_id, query, dbName);
  }

  // 6. Get all input parameters and their types from an SP
  getSPParameters(connection_id: string, dbName: string, schemaName: string, spName: string): Observable<GetSPParametersResponse[] | ErrorResponse> {
    const query = `
      SELECT  
         TRIM(LEADING '@' FROM name) AS 'Parameter_name',  
         type_name(user_type_id) AS 'Type',  
         max_length AS 'Length',  
         CASE WHEN type_name(system_type_id) = 'uniqueidentifier' 
              THEN precision  
              ELSE OdbcPrec(system_type_id, max_length, precision) END AS 'Prec',  
         OdbcScale(system_type_id, scale) AS 'Scale',  
         parameter_id AS 'Param_order',  
         CONVERT(sysname, 
                 CASE WHEN system_type_id IN (35, 99, 167, 175, 231, 239)  
                 THEN ServerProperty('collation') END) AS 'Collation'  
      FROM sys.parameters 
      WHERE object_id = OBJECT_ID('${schemaName}.${spName}');
    `;
    return this.mssql.executeQuery<GetSPParametersResponse>(connection_id, query, dbName);
  }

  // 7. Get all return columns and their types from an SP
  getSPReturnColumns(connection_id: string, dbName: string, schemaName: string, spName: string): Observable<GetSPReturnColumnsResponse[] | ErrorResponse> {
    const query = `
      SELECT name AS 'column', system_type_name
      FROM sys.dm_exec_describe_first_result_set_for_object(
        OBJECT_ID('${schemaName}.${spName}'), 
        NULL
      );
    `;
    return this.mssql.executeQuery<GetSPReturnColumnsResponse>(connection_id, query, dbName);
  }
}
