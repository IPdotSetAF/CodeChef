import { AfterContentInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeLast, tap } from 'rxjs';
import { CodeAreaComponent } from '../code-area/code-area.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Meta } from '@angular/platform-browser';
import { parse } from 'marked';

@Component({
  selector: 'app-md2html',
  standalone: true,
  imports: [FormsModule, CodeAreaComponent],
  templateUrl: './md2html.component.html',
  animations: [
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
export class Md2htmlComponent implements AfterContentInit {
  protected mdCode: string = `# Hello world
this is an example :p`;
  protected htmlCode !: string;
  protected status: boolean = false;

  protected inputDebouncer = new Subject<string>();

  constructor(meta: Meta) {
    meta.addTags([
      { name: "description", content: "Converts Markdown code to HTML code." },
      { name: "keywords", content: "markdown, markup, html, tags, content, convert" },
    ]);
  }

  ngAfterContentInit(): void {
    this.inputDebouncer.pipe(
      debounceTime(500),
      tap(value => this.convert(value)),
      takeLast(1),
    ).subscribe();

    this.convert(this.mdCode);
  }

  protected convert(mdCode?: string) {
    let code = mdCode ? mdCode : this.mdCode;
    this.htmlCode = parse(code, { async: false });
    this.status = !this.status;
  }

}
