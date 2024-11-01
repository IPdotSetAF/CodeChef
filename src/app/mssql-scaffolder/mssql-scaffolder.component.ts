import { Component } from '@angular/core';
import { CodeAreaComponent } from "../code-area/code-area.component";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MssqlService } from '../../services/mssql/mssql.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppComponent } from '../app/app.component';
import { ConnectRequest, ConnectResponse, ErrorResponse } from '../../services/mssql/mssql.model';
import { MssqlScaffolderService } from './mssql-scaffolder.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-database-tools',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CodeAreaComponent],
  templateUrl: './mssql-scaffolder.component.html',
  animations: [
    trigger('connection', [
      state("0", style({ "border-width": "3px", "border-color": "var(--bs-border-color)" })),
      state("1", style({ "border-width": "3px", "border-color": "var(--bs-warning)" })),
      state("2", style({ "border-width": "3px", "border-color": "limegreen" })),
      transition('* <=> *', [
        animate('0.1s ease-in-out'),
      ]),
    ])
  ]
})
export class MssqlScaffoldComponent {
  protected dbSettings: FormGroup = new FormGroup<DbSetting>(
    {
      server: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }
  );
  protected scaffoldForm: FormGroup = new FormGroup<ScaffoldForm>(
    {
      database: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      schema: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }
  );
  protected status: ConnectionStatus = ConnectionStatus.disconnected;
  protected connectionStatus = ConnectionStatus;
  protected connectionError!: string | null;
  protected csCode: string = "";

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
  }

  protected async connect() {
    if (!AppComponent.isBrowser)
      return;

    if (this.status == this.connectionStatus.disconnected) {
      this.status = this.connectionStatus.connecting;
      this.dbSettings.disable();
      this.mssql.connect(this.dbSettings.getRawValue() as ConnectRequest).subscribe({
        next: (res) => {
          res = res as ConnectResponse;
          this.connectionID = res.connection_id;
          this.status = this.connectionStatus.connected;
          this.connectionError = null;
        },
        error: (err) => {
          this.status = this.connectionStatus.disconnected;
          this.dbSettings.enable();
          this.connectionError = (err.error as ErrorResponse).detail;
        }
      });
    } else
      this.mssql.disconnect({
        connection_id: this.connectionID
      }).subscribe({
        next: (res) => {
          this.status = this.connectionStatus.disconnected;
          this.dbSettings.enable();
          this.connectionError = null;
        },
        error: (err) => {
          this.connectionError = (err.error as ErrorResponse).detail;
        }
      });
  }

  protected getDBs() {

  }

  protected getSchemas() {

  }

  protected getTables() {

  }

  protected getSPs() {

  }

  protected scaffold() {

  }
}

enum ConnectionStatus {
  disconnected,
  connecting,
  connected
}

interface DbSetting {
  server: AbstractControl<string>;
  username: AbstractControl<string>;
  password: AbstractControl<string>;
}

interface ScaffoldForm {
  database: AbstractControl<string>;
  schema: AbstractControl<string>;
}