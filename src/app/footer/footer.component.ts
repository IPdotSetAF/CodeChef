import { Component } from '@angular/core';
import { AppComponent } from '../app/app.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  protected version = AppComponent.version;
}
