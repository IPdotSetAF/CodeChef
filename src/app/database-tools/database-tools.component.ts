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
      state("true", style({ "border-width": "3px", "border-color": "limegreen" })),
      state("false", style({ "border-width": "3px", "border-color": "var(--bs-border-color)" })),
      transition('* <=> *', [
        animate('0.1s ease-in-out'),
      ]),
    ])
  ]
})
export class DatabaseToolsComponent {
  protected connectionString: string = "";
  protected status: boolean = false;

  constructor(
    private mssql: MssqlService
  ) {
  }

  protected async connect(status: boolean) {
    if (!AppComponent.isBrowser)
      return;

    if (status)
      await this.mssql.connect(this.connectionString);
    else
      await this.mssql.disconnect();
    this.status = !this.status;
  }
}
