import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConnectRequest, ConnectResponse, QueryRequest, ExecuteQueryResponse, DisconnectRequest, DisconnectResponse, ErrorResponse, GetAllSchemasResponse, GetAllDatabasesResponse, GetStoredProceduresResponse, GetTablesResponse } from './mssql.model';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class MssqlService {
  private apiUrl = 'http://localhost:50505'; // Base URL for the proxy server

  constructor(private http: HttpClient) { }

  // Connect to the database
  connect(request: ConnectRequest): Observable<ConnectResponse | ErrorResponse> {
    return this.http.post<ConnectResponse | ErrorResponse>(`${this.apiUrl}/connect`, request);
  }

  // Execute a SQL query on an active connection
  executeQuery<T>(connection_id: string, query: string): Observable<T[] | ErrorResponse> {
    return this.http.post<ExecuteQueryResponse<T> | ErrorResponse>(`${this.apiUrl}/execute-query`, { connection_id, query }).pipe(
      map(res => (res as ExecuteQueryResponse<T>).data)
    );
  }

  // Disconnect from the database
  disconnect(connection_id: string): Observable<DisconnectResponse | ErrorResponse> {
    return this.http.post<DisconnectResponse | ErrorResponse>(`${this.apiUrl}/disconnect`, { connection_id });
  }

  // 1. Get all databases
  getAllDatabases(connection_id: string): Observable<GetAllDatabasesResponse[] | ErrorResponse> {
    const query = "SELECT name, database_id FROM sys.databases;";
    return this.executeQuery<GetAllDatabasesResponse>(connection_id, query);
  }

  // 2. Get all schemas
  getAllSchemas(connection_id: string, dbName: string): Observable<GetAllSchemasResponse[] | ErrorResponse> {
    const query = `SELECT CATALOG_NAME, SCHEMA_NAME FROM ${dbName}.information_schema.schemata WHERE SCHEMA_OWNER = 'dbo';`;
    return this.executeQuery<GetAllSchemasResponse>(connection_id, query);
  }

  // 3. Get all stored procedures from a schema
  getStoredProcedures(connection_id: string, dbName: string, schemaName: string): Observable<GetStoredProceduresResponse[] | ErrorResponse> {
    const query = `SELECT SPECIFIC_CATALOG, SPECIFIC_SCHEMA, SPECIFIC_NAME FROM ${dbName}.information_schema.routines WHERE routine_type = 'PROCEDURE' AND specific_schema = '${schemaName}';`;
    return this.executeQuery<GetStoredProceduresResponse>(connection_id, query);
  }

  // 4. Get all tables from a schema
  getTables(connection_id: string, dbName: string, schemaName: string): Observable<GetTablesResponse[] | ErrorResponse> {
    const query = `SELECT name, object_id FROM ${dbName}.sys.tables WHERE schema_name(schema_id) = '${schemaName}' ORDER BY name;`;
    return this.executeQuery<GetTablesResponse>(connection_id, query);
  }
}