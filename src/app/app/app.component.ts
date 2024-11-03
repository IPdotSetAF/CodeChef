import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import packageJson from '../../../package.json';
import { Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public static version: string = packageJson.version;
  public static isBrowser = false;
  protected header: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    meta: Meta,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    AppComponent.isBrowser = isPlatformBrowser(this.platformId);
    meta.addTag({ name: "author", content: "IPdotSetAF" });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      map(data => {
        this.header = data['header'] ?? true;
      })
    ).subscribe();
  }
}
