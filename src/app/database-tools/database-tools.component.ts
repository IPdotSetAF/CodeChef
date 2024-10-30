import { Component } from '@angular/core';
import { CodeAreaComponent } from "../code-area/code-area.component";
import { FormsModule } from '@angular/forms';
import { MssqlService } from './mssql.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppComponent } from '../app/app.component';

@Component({
  selector: 'app-database-tools',
  standalone: true,
  imports: [FormsModule, CodeAreaComponent],
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
  protected connectionString: string = "";
  protected status: ConnectionStatus = ConnectionStatus.disconnected;
  protected connections = ConnectionStatus;

  constructor(
    private mssql: MssqlService
  ) {
  }

  protected async connect(status: boolean) {
    if (!AppComponent.isBrowser)
      return;

    // if (status)
    //   await this.mssql.connect(this.connectionString);
    // else
    //   await this.mssql.disconnect();
    this.status++;
    this.status = this.status % 3;
  }
}

enum ConnectionStatus {
  disconnected,
  connecting,
  connected
}
