import { Component } from '@angular/core';
import { AppComponent } from '../app/app.component';

@Component({
  selector: 'app-downloads',
  standalone: true,
  imports: [],
  templateUrl: './downloads.component.html'
})
export class DownloadsComponent {
  protected version:string = AppComponent.version;
}
