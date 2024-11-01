// Request interfaces
export interface ConnectRequest {
    server: string;
    username: string;
    password: string;
}

export interface QueryRequest {
    connection_id: string;
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

export interface ExecuteQueryResponse {
    status: "success";
    data: Array<Record<string, any>>; // Array of objects with column name as key and value as column data
}

export interface DisconnectResponse {
    status: "disconnected";
    connection_id: string;
}

// Error response interface
export interface ErrorResponse {
    detail: string;
}
