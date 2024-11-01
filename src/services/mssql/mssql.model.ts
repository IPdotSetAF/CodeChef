// Request interfaces
export interface ConnectRequest {
    server: string;
    username: string;
    password: string;
}

export interface QueryRequest {
    connection_id: string;
    catalog: string | null;
    query: string;
}

export interface DisconnectRequest {
    connection_id: string;
}

// Response interfaces
export interface ConnectResponse {
    status: "connected";
    connection_id: string;
}

export interface ExecuteQueryResponse<T> {
    status: "success";
    data: T[];
}

export interface DisconnectResponse {
    status: "disconnected";
    connection_id: string;
}

export interface GetAllDatabasesResponse {
    name: string;
    database_id: number;
}

export interface GetAllSchemasResponse {
    CATALOG_NAME: string;
    SCHEMA_NAME: string;
}

export interface GetStoredProceduresResponse {
    SPECIFIC_CATALOG: string;
    SPECIFIC_SCHEMA: string;
    SPECIFIC_NAME: string;
}

export interface GetTablesResponse {
    name: string;
    object_id: number;
}

// Error response interface
export interface ErrorResponse {
    detail: string;
}
