import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConnectRequest, ConnectResponse, QueryRequest, ExecuteQueryResponse, DisconnectRequest, DisconnectResponse, ErrorResponse } from './mssql.model';

@Injectable({
  providedIn: 'root'
})
export class MssqlService {
  private apiUrl = 'http://localhost:50505'; // Base URL for the proxy server

  constructor(private http: HttpClient) {}

  // Connect to the database
  connect(request: ConnectRequest): Observable<ConnectResponse | ErrorResponse> {
    return this.http.post<ConnectResponse | ErrorResponse>(`${this.apiUrl}/connect`, request);
  }

  // Execute a SQL query on an active connection
  executeQuery(request: QueryRequest): Observable<ExecuteQueryResponse | ErrorResponse> {
    return this.http.post<ExecuteQueryResponse | ErrorResponse>(`${this.apiUrl}/execute-query`, request);
  }

  // Disconnect from the database
  disconnect(request: DisconnectRequest): Observable<DisconnectResponse | ErrorResponse> {
    return this.http.post<DisconnectResponse | ErrorResponse>(`${this.apiUrl}/disconnect`, request);
  }
}