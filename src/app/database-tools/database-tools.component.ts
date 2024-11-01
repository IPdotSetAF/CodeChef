import { Component } from '@angular/core';
import { CodeAreaComponent } from "../code-area/code-area.component";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MssqlService } from './mssql.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppComponent } from '../app/app.component';
import { ConnectRequest, ConnectResponse } from './mssql.model';

@Component({
  selector: 'app-database-tools',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CodeAreaComponent],
  templateUrl: './database-tools.component.html',
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
export class DatabaseToolsComponent {
  protected dbSettings: FormGroup = new FormGroup<DbSetting>(
    {
      server: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }
  )
  protected status: ConnectionStatus = ConnectionStatus.disconnected;
  protected connectionStatus = ConnectionStatus;
  protected csCode: string = "";

  private connectionID !: string;
  constructor(
    private mssql: MssqlService
  ) { }

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
        },
        error: (err) => {
          this.status = this.connectionStatus.disconnected;
          this.dbSettings.enable();
        }
      });
    } else
      this.mssql.disconnect({
        connection_id: this.connectionID
      }).subscribe((res) => {
        this.status = this.connectionStatus.disconnected;
        this.dbSettings.enable();
      });
  }

  protected scaffold(){
    
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