import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  input,
  model,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { createEditor, PrismEditor } from "prism-code-editor";
import { matchBrackets } from "prism-code-editor/match-brackets";
import { highlightBracketPairs } from "prism-code-editor/highlight-brackets";
import { editHistory } from "prism-code-editor/commands";
import { copyButton } from "prism-code-editor/copy-button";
import "prism-code-editor/prism/languages/json";
import "prism-code-editor/prism/languages/yaml";
import "prism-code-editor/prism/languages/http";
import "prism-code-editor/prism/languages/java";
import "prism-code-editor/prism/languages/kotlin";
import "prism-code-editor/prism/languages/markdown";
import "prism-code-editor/prism/languages/xml";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'code-area',
  standalone: true,
  imports: [],
  template: "<div #editorContainer></div>",
  styles: [
    `
      :host > div {
        margin-bottom: 0.5em;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None
})
export class CodeAreaComponent implements AfterViewInit, OnChanges {
  code = model<string>("");
  language = input<string>("markdown");
  readonly = input<boolean, string>(false, {
    transform: (value: string) => value == "true",
  });
  editor: PrismEditor | undefined = undefined;

  @ViewChild("editorContainer") editorContainer!: ElementRef;

  isBrowser = false;
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser)
      return;

    if (this.editorContainer.nativeElement) {
      this.editor = this.initEditor();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["code"].previousValue !== changes["code"].currentValue) {
      this.editor?.setOptions({ value: changes["code"].currentValue });
    }
  }

  initEditor(): PrismEditor {
    const editor = createEditor(this.editorContainer.nativeElement, {
      value: this.code(),
      language: this.language(),
      lineNumbers: false,
      wordWrap: true,
      readOnly: this.readonly(),

      onUpdate: (code: string) => {
        this.code.set(code);
      },
    });
    editor.addExtensions(
      copyButton(),
      matchBrackets(true),
      highlightBracketPairs(),
      editHistory()
    );

    this.code.subscribe(() => {
      this.editor?.update();
    });

    return editor;
  }
}