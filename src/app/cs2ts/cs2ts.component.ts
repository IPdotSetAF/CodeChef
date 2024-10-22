import { AfterContentInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
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

  protected regex !: RegExp;
  protected replace !: string;

  protected inputDebouncer = new Subject<string>();

  ngAfterContentInit(): void {
    this.inputDebouncer.pipe(
      debounceTime(500),
      tap(value => this.convert(value)),
      takeLast(1),
    ).subscribe();
  }

  protected convert(csCode?: string) {
    let value = csCode ? csCode : this.csModel;
    //$<name> : $<gen:+$<gen><<$<num:+number:>$<str>$<bool:+boolean:>$<type>$<arr2:+[]>>>:$<num:+number:>$<str>$<bool:+boolean:>$<type>$<arr2:+[]>>$<arr1:+[]>$<arr3:+[]> ;
    this.tsModel = value.replaceAll(/public ((?<arr1>IEnumerable<|List<|ICollection<)|(?<gen>\w+)<)*((?<num>int|float|double|decimal|long)|(?<str>string)|(?<bool>bool)|(?<type>\w+))(?<arr2>\[\])?(>)?(?<arr3>\[\])? (?<name>\w+) (.+)/gm, this.replace);
  }
}
