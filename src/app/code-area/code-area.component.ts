import { AfterViewInit, Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-csharp';
import 'prismjs/plugins/toolbar/prism-toolbar';

@Component({
  selector: 'code-area',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './code-area.component.html',
  styleUrl: './code-area.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CodeAreaComponent implements AfterViewInit {
  @Input() public code!: string;
  @Output() public codeChange = new EventEmitter<string>();

  @Input() public placeholder!: string;
  @Input() public language = 'csharp';

  protected codeHtml!: string;
  private grammar!: Prism.Grammar;

  constructor() { }

  ngAfterViewInit() {
    this.grammar = Prism.languages[this.language];

    if (this.code)
      this.highlight(this.code)
  }

  protected onInput() {
    this.codeHtml = this.highlight(this.code);
    Prism.highlightAll();
    this.codeChange.emit(this.code);
  }

  private highlight(code: string): string {
    return Prism.highlight(code, this.grammar, this.language);
  }
}