import { AfterContentInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeLast, tap } from 'rxjs';

@Component({
  selector: 'app-cs2ts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cs2ts.component.html',
  styleUrl: './cs2ts.component.css'
})
export class Cs2tsComponent implements AfterContentInit {
  protected csModel !: string;
  protected tsModel !: string;

  protected inputDebouncer = new Subject<string>();

  ngAfterContentInit(): void {
    this.inputDebouncer.pipe(
      debounceTime(500),
      tap(value => this.convert(value)),
      takeLast(1),
    ).subscribe();
  }

  protected convert(csCode?: string) {
    const value = csCode ? csCode : this.csModel;

    this.tsModel = value;
  }
}
