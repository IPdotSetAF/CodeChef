import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import packageJson from '../../../package.json';
import { Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public static version: string = packageJson.version;
  public static isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    meta: Meta
  ) {
    AppComponent.isBrowser = isPlatformBrowser(this.platformId);
    meta.addTag({ name: "author", content: "IPdotSetAF" });
  }
}
