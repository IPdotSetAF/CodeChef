import { Component } from '@angular/core';
import { CodeAreaComponent } from "../code-area/code-area.component";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MssqlService } from '../../services/mssql/mssql.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppComponent } from '../app/app.component';
import { ConnectRequest, ConnectResponse, ErrorResponse, GetAllDatabasesResponse, GetAllSchemasResponse, GetStoredProceduresResponse, GetTablesResponse } from '../../services/mssql/mssql.model';
import { MssqlScaffolderService } from './mssql-scaffolder.service';
import { Meta } from '@angular/platform-browser';
import { GetColumnsResponse, GetSPReturnColumnsResponse, SPDefinition, SPParam } from './mssql-scaffolder.model';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mssql-scaffolder',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CodeAreaComponent, RouterLink],
  templateUrl: './mssql-scaffolder.component.html',
  animations: [
    trigger('connection', [
      state("0", style({ "border-width": "3px", "border-color": "var(--bs-border-color)" })),
      state("1", style({ "border-width": "3px", "border-color": "var(--bs-warning)" })),
      state("2", style({ "border-width": "3px", "border-color": "limegreen" })),
      transition('* <=> *', [
        animate('0.1s ease-in-out'),
      ]),
    ]),
    trigger('valueChangeAnim', [
      transition('* <=> *', [
        animate('0.07s ease-out', style({ "border-color": "limegreen" })),
        animate('0.07s ease-in', style({ "border-color": "var(--bs-border-color)" }))
      ]),
    ])
  ],
  styles: `
  .code-border{
    border: 3px solid var(--bs-border-color);
  }
  `
})
export class MssqlScaffolderComponent {
  protected dbSettings: FormGroup = new FormGroup<DbSetting>(
    {
      proxy: new FormControl('http://localhost:50505', { nonNullable: true, validators: [Validators.required] }),
      server: new FormControl('.', { nonNullable: true, validators: [Validators.required] }),
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }
  );
  protected scaffoldForm: FormGroup = new FormGroup<ScaffoldForm>(
    {
      database: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      schema: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
      isTable: new FormControl(true, { nonNullable: true })
    }
  );
  protected status: ConnectionStatus = ConnectionStatus.disconnected;
  protected connectionStatus = ConnectionStatus;
  protected connectionError!: string | null;
  protected csCode: string = "";
  protected codeFlip: boolean = false;
  protected isTable: boolean = true;

  protected Dbs!: GetAllDatabasesResponse[];
  protected Schemas!: GetAllSchemasResponse[];
  protected Tables!: GetTablesResponse[];
  protected Sps!: GetStoredProceduresResponse[];

  private connectionID !: string;

  constructor(
    private mssql: MssqlService,
    private scaffolder: MssqlScaffolderService,
    meta: Meta
  ) {
    meta.addTags([
      { name: "description", content: "Scaffolds MSSQL table models and stored procedures input and output models to C# classes." },
      { name: "keywords", content: "C#, MSSQL, CSharp, microsoft, scaffold, db-first, database, model, DTO, class, table, schema, stored procedure, SQL server, code generator" },
    ]);

    this.initForm();
  }

  private initForm() {
    this.scaffoldForm.controls["database"].valueChanges.subscribe(v => {
      if (!v || v == '')
        return;
      this.getSchemas();
    });

    this.scaffoldForm.controls["schema"].valueChanges.subscribe(v => {
      if (!v || v == '')
        return;
      this.scaffoldForm.controls["isTable"].enable();
      if (this.isTable)
        this.getTables();
      else
        this.getSPs();
    });

    let c = new FormControl("", { nonNullable: true, validators: [Validators.required] });
    c.disable();
    this.scaffoldForm.addControl("table", c);

    this.scaffoldForm.controls["isTable"].valueChanges.subscribe(v => {
      if (this.isTable === v)
        return;
      const sc = this.scaffoldForm.getRawValue();
      this.isTable = v;
      if (v) {
        this.scaffoldForm.removeControl("sp");
        this.scaffoldForm.addControl("table", new FormControl("", { nonNullable: true, validators: [Validators.required] }));
        if (sc.database && sc.database != '' && sc.schema && sc.schema != '')
          this.getTables();
      } else {
        this.scaffoldForm.removeControl("table");
        this.scaffoldForm.addControl("sp", new FormControl("", { nonNullable: true, validators: [Validators.required] }));
        if (sc.database && sc.database != '' && sc.schema && sc.schema != '')
          this.getSPs();
      }
    });

    this.scaffoldForm.disable();
  }

  protected async connect() {
    if (!AppComponent.isBrowser)
      return;

    if (this.status == this.connectionStatus.disconnected) {
      this.status = this.connectionStatus.connecting;
      this.dbSettings.disable();
      MssqlService.apiUrl = this.dbSettings.controls["proxy"].value;
      this.mssql.connect(this.dbSettings.getRawValue() as ConnectRequest).subscribe({
        next: (res) => {
          res = res as ConnectResponse;
          this.connectionID = res.connection_id;
          this.status = this.connectionStatus.connected;
          this.connectionError = null;
          this.getDBs();
        },
        error: (err) => {
          this.status = this.connectionStatus.disconnected;
          this.dbSettings.enable();
          if (err.status != 0)
            this.connectionError = (err.error as ErrorResponse).detail;
          else
            this.connectionError = "Could not connect to the MSSQL proxy server. Make sure the MSSQL proxy server is running and its address is configured properly."
        }
      });
    } else
      this.mssql.disconnect(this.connectionID).subscribe({
        next: (res) => {
          this.connectionError = null;
          this.status = this.connectionStatus.disconnected;
          this.dbSettings.enable();
          this.scaffoldForm.disable();
        },
        error: (err) => {
          this.connectionError = (err.error as ErrorResponse).detail;
          this.status = this.connectionStatus.disconnected;
          this.dbSettings.enable();
          this.scaffoldForm.disable();
        }
      });
  }

  protected getDBs() {
    this.mssql.getAllDatabases(this.connectionID).subscribe((res) => {
      this.Dbs = res as GetAllDatabasesResponse[];
      this.scaffoldForm.controls["database"].enable();
    });
  }

  protected getSchemas() {
    const sc = this.scaffoldForm.getRawValue();
    this.mssql.getAllSchemas(this.connectionID, sc.database).subscribe((res) => {
      this.Schemas = res as GetAllSchemasResponse[];
      this.scaffoldForm.controls["schema"].enable();
    });
  }

  protected getTables() {
    const sc = this.scaffoldForm.getRawValue();
    this.mssql.getTables(this.connectionID, sc.database, sc.schema).subscribe((res) => {
      this.Tables = res as GetTablesResponse[];
      this.scaffoldForm.controls["table"].enable();
    });
  }

  protected getSPs() {
    const sc = this.scaffoldForm.getRawValue();
    this.mssql.getStoredProcedures(this.connectionID, sc.database, sc.schema).subscribe((res) => {
      this.Sps = res as GetStoredProceduresResponse[];
      this.scaffoldForm.controls["sp"].enable();
    });
  }

  protected scaffold() {
    if (this.isTable)
      this.scaffoldTable();
    else
      this.scaffoldSP();
  }

  private scaffoldTable() {
    const sc = this.scaffoldForm.getRawValue();
    this.scaffolder.getColumns(
      this.connectionID, sc.database, sc.table).subscribe(res => {
        res = res as GetColumnsResponse[];
        this.csCode =
          `public class ${sc.table} {
${res.map((p) => `\tpublic ${MssqlScaffolderComponent.convertDataType(p.DataType)}${p.IsNullable ? '?' : ''} ${p.ColumnName} { get; set; }\n`).reduce((a, b) => a + b)}}`;
        this.codeFlip = !this.codeFlip;
      });
  }

  private scaffoldSP() {
    const sc = this.scaffoldForm.getRawValue();

    forkJoin({
      params: this.scaffolder.getSPDefinition(this.connectionID, sc.database, sc.schema, sc.sp),
      result: this.scaffolder.getSPReturnColumns(this.connectionID, sc.database, sc.schema, sc.sp)
    }).subscribe(vals => {
      const spDef = (vals.params as SPDefinition[])[0].definition;
      const spUpper = spDef.toUpperCase();

      const ps = [...(spDef.substring(spUpper.indexOf("CREATE PROCEDURE"), spUpper.indexOf("AS"))
        .matchAll(/@(?<name>\w+) +(?<type>\w+(\(.*\)){0,1}) *=* *(?<nul>(NULL){0,1})/gmi))].map(match => {
          if (match.groups)
            return {
              Parameter_name: match.groups['name'],
              Type: match.groups['type'],
              Nullable: match.groups['nul'] && match.groups['nul'].length > 0 ? true : false
            } as SPParam;
          return undefined;
        }).filter(v => v) as SPParam[];
      const rs = vals.result as GetSPReturnColumnsResponse[];

      const psc = ps.map((p) => `\tpublic ${MssqlScaffolderComponent.convertDataType(p.Type)}${p.Nullable ? '?' : ''} ${p.Parameter_name} { get; set; }`);
      const rsc = rs.map((p) => `\tpublic ${MssqlScaffolderComponent.convertDataType(p.system_type_name)}${p.Nullable ? '?' : ''} ${p.column} { get; set; }`);

      this.csCode =
        `${psc.length > 0 ? `public class ${sc.sp}Params {` : ''}
${psc.join("\n")}
${psc.length > 0 ? '}' : ''}

${rsc.length > 0 ? `public class ${sc.sp}Result {` : ''}
${rsc.join("\n")}
${rsc.length > 0 ? '}' : ''}`;
      this.codeFlip = !this.codeFlip;
    });
  }

  private static convertDataType(type: string): string {
    type = type.replace(/\(.+\)/gm, '');
    switch (type.toLowerCase()) {
      case "int":
        return "int";
      case "bigint":
        return "long";
      case "smallint":
        return "short";
      case "tinyint":
        return "byte";
      case "bit":
        return "bool";
      case "decimal":
      case "numeric":
        return "decimal";
      case "money":
      case "smallmoney":
        return "decimal";
      case "float":
        return "double";
      case "real":
        return "float";
      case "date":
      case "datetime":
      case "datetime2":
      case "smalldatetime":
      case "datetimeoffset":
        return "DateTime";
      case "time":
        return "TimeSpan";
      case "char":
      case "varchar":
      case "text":
      case "nchar":
      case "nvarchar":
      case "ntext":
        return "string";
      case "binary":
      case "varbinary":
      case "image":
        return "byte[]";
      case "uniqueidentifier":
        return "Guid";
      case "xml":
        return "XmlDocument";
      case "geography":
      case "geometry":
      case "hierarchyid":
        return "SqlGeography";
      default:
        return type;
    }
  }
}

enum ConnectionStatus {
  disconnected,
  connecting,
  connected
}

interface DbSetting {
  proxy: AbstractControl<string>;
  server: AbstractControl<string>;
  username: AbstractControl<string>;
  password: AbstractControl<string>;
}

interface ScaffoldForm {
  database: AbstractControl<string>;
  schema: AbstractControl<string>;
  isTable: AbstractControl<boolean>;
}