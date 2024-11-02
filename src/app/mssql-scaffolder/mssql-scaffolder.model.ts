export interface GetColumnsResponse {
    ColumnName: string;
    DataType: string;
    MaxLength: number;
    Precision: number;
    Scale: number;
    IsNullable: boolean;
    PrimaryKey: boolean;
  }
  
  export interface GetSPParametersResponse {
    Parameter_name: string;
    Type: string;
    Length: number;
    Prec: number;
    Scale: number;
    Param_order: number;
    Collation: string | null;
    Nullable: boolean;
  }
  
  export interface GetSPReturnColumnsResponse {
    column: string;
    system_type_name: string;
    Nullable: boolean;
  }