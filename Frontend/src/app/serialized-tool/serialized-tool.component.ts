import { AfterContentInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeLast, tap } from 'rxjs';
import { CodeAreaComponent } from '../code-area/code-area.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Meta } from '@angular/platform-browser';
import { parse as tomlParse, stringify as tomlStringify } from 'smol-toml';
import { XMLParser as xmlParse, XMLBuilder as xmlStringify } from 'fast-xml-parser';
import YAML from 'yamljs';

@Component({
  selector: 'app-serialized-tool',
  standalone: true,
  imports: [FormsModule, CodeAreaComponent],
  templateUrl: './serialized-tool.component.html',
  animations: [
    trigger('valueChangeAnim', [
      transition('* <=> *', [
        animate('0.07s ease-out', style({ "border-color": "limegreen" })),
        animate('0.07s ease-in', style({ "border-color": "var(--bs-border-color)" }))
      ]),
    ]),
    trigger('hasError', [
      state('true', style({ "border-color": "red" })),
      state('false', style({ "border-color": "var(--bs-border-color)" })),
      transition('* <=> *', [
        animate('0.2s ease-in-out')
      ]),
    ]),
  ],
  styles: `
  .code-border{
    border: 3px solid var(--bs-border-color);
  }
  `
})
export class SerializedToolComponent implements AfterContentInit {
  protected fromCode: string = `{
  "hello" : "world :p"
}`;
  protected toCode !: string;
  protected fromLang: string = "json";
  protected toLang: string = "xml";
  protected status: boolean = false;
  protected hasError: boolean = false;

  protected inputDebouncer = new Subject<string>();

  constructor(meta: Meta) {
    meta.addTags([
      { name: "description", content: "Converts Json, xml, yaml, toml data to each other" },
      { name: "keywords", content: "json, xml, yaml, yml, toml, serilized, serilization, data, object, structure, convert" },
    ]);
  }

  ngAfterContentInit(): void {
    this.inputDebouncer.pipe(
      debounceTime(500),
      tap(value => this.convert(value)),
      takeLast(1),
    ).subscribe();

    this.convert(this.fromCode);
  }

  protected convert(mdCode?: string) {
    let code = mdCode ? mdCode : this.fromCode;

    try {
      var obj;
      switch (this.fromLang) {
        case "json":
          obj = JSON.parse(code);
          break;
        case "xml":
          obj = new xmlParse().parse(code);
          break;
        case "yaml":
          obj = YAML.parse(code);
          break;
        case "toml":
          obj = tomlParse(code);
          break;
      }
      this.hasError = false;

      switch (this.toLang) {
        case "json":
          this.toCode = JSON.stringify(obj);
          break;
        case "xml":
          this.toCode = new xmlStringify().build(obj);
          break;
        case "yaml":
          this.toCode = YAML.stringify(obj);
          break;
        case "toml":
          this.toCode = tomlStringify(obj);
          break;
      }
    } catch {
      this.hasError = true;
      this.toCode = "";
    }

    this.status = !this.status;
  }

}
