import { AfterViewInit, Component, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import Prism from 'prismjs';
import { debounceTime, Subject, takeLast, tap } from 'rxjs';

@Component({
  selector: 'code-area, [code-area]',
  standalone: true,
  imports: [],
  template: '<ng-content></ng-content>',
  styleUrl: './code-area.component.css'
})
export class CodeAreaComponent implements AfterViewInit {
  @Input()
  code!: string;

  @Output()
  codeChange = new EventEmitter<string>();

  @Input()
  language = 'javascript';

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    this.highlight(this.code || this.el.nativeElement.value)

    this.inputDebouncer.pipe(
      debounceTime(500),
      tap(value => this.highlight(value)),
      takeLast(1),
    ).subscribe();

    this.codeChange.subscribe(v => this.highlight(v));
  }

  private inputDebouncer = new Subject<string>();

  @HostListener("input")
  protected onInput() {
    this.inputDebouncer.next(this.el.nativeElement.value);
  }

  private highlight(code: string) {
    const grammar = Prism.languages[this.language];
    const html = Prism.highlight(code, grammar, this.language);
    this.el.nativeElement.innerHTML = html;
    console.log(html);
  }
}