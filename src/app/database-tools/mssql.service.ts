import { Injectable } from '@angular/core';
import { ConnectionPool } from 'mssql';

@Injectable({
  providedIn: 'root'
})
export class MssqlService {
  private pool: ConnectionPool | null = null;

  async connect(connectionString: string): Promise<boolean> {
    
    var sql = await import("mssql");

    if (!this.pool) {
      this.pool = await sql.connect(connectionString);
      console.log('Connected to the database.');
    }
    return true;
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log('Disconnected from the database.');
    }
  }

  async getStoredProcedureParams(spName: string, schema: string = 'dbo'): Promise<any> {
    // const result = await this.pool?.request().execute(`[${schema}].[${spName}]`);
    // return result.parameters;
  }

  async getSchemaList(): Promise<any> {
    // const result = await this.pool?.request().query('SELECT * FROM information_schema.schemata');
    // return result.recordset;
  }
}
