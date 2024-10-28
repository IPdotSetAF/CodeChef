import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  input,
  model,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { createEditor, PrismEditor } from "prism-code-editor";
import { matchBrackets } from "prism-code-editor/match-brackets";
import { highlightBracketPairs } from "prism-code-editor/highlight-brackets";
import { editHistory } from "prism-code-editor/commands";
import { copyButton } from "prism-code-editor/copy-button";
import "prism-code-editor/prism/languages/json";
import "prism-code-editor/prism/languages/yaml";
import "prism-code-editor/prism/languages/toml";
import "prism-code-editor/prism/languages/java";
import "prism-code-editor/prism/languages/xml";
import "prism-code-editor/prism/languages/csharp";
import "prism-code-editor/prism/languages/typescript";
import "prism-code-editor/prism/languages/markup";

@Component({
  selector: 'code-area',
  standalone: true,
  imports: [],
  template: '<div style="display: grid; {{innerStyle}}" class="{{innerClass}}" #editorContainer></div>',
  styleUrl: './code-area.component.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CodeAreaComponent implements AfterViewInit, OnChanges {
  code = model<string>("");
  language = input<string>("typescript");
  readonly = input<boolean, string>(false, {
    transform: (value: string) => value == "true",
  });
  @Input() innerStyle!: string;
  @Input() innerClass!: string;
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
      lineNumbers: true,
      wordWrap: false,
      readOnly: this.readonly(),

      onUpdate: (code: string) => {
        this.code.set(code);
      },
    });
    editor.addExtensions(
      copyButton(),
      matchBrackets(true),
      highlightBracketPairs(),
      editHistory(),
    );

    this.code.subscribe(() => {
      this.editor?.update();
    });

    return editor;
  }
}