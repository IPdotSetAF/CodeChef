import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeLast, tap } from 'rxjs';
import { CodeAreaComponent } from '../code-area/code-area.component';

@Component({
  selector: 'app-cs2ts',
  standalone: true,
  imports: [FormsModule, CodeAreaComponent],
  templateUrl: './cs2ts.component.html',
  styleUrl: './cs2ts.component.css'
})
export class Cs2tsComponent implements AfterContentInit {
  @ViewChild("csCode", { read: ElementRef })
  protected csCode!: ElementRef<HTMLInputElement>;
  @ViewChild("tsCode", { read: ElementRef })
  protected tsCode!: ElementRef<HTMLInputElement>;

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

  protected onInput() {
    this.inputDebouncer.next(this.csModel);
    this.csCode.nativeElement.style.height = "auto";
    this.csCode.nativeElement.style.height = `${this.csCode.nativeElement.scrollHeight + 5}px`;
    this.tsCode.nativeElement.style.height = "auto";
    this.tsCode.nativeElement.style.height = `${this.csCode.nativeElement.scrollHeight + 5}px`;
  }

  protected convert(csCode?: string) {
    let value = csCode ? csCode : this.csModel;

    //$<name> : $<gen:+$<gen><<$<num:+number:>$<str>$<bool:+boolean:>$<type>$<arr2:+[]>>>:$<num:+number:>$<str>$<bool:+boolean:>$<type>$<arr2:+[]>>$<arr1:+[]>$<arr3:+[]> ;
    this.tsModel = value.replaceAll(/public ((?<arr1>IEnumerable<|List<|ICollection<)|(?<gen>\w+)<)*((?<num>int|float|double|decimal|long)|(?<str>string)|(?<bool>bool)|(?<type>\w+))(?<arr2>\[\])?(>)?(?<arr3>\[\])? (?<name>\w+) (.+)/gm, "");

    // this.tsModel = value.replace(/public ((?<arr1>IEnumerable<|List<|ICollection<)|(?<gen>\w+)<)*((?<num>int|float|double|decimal|long)|(?<str>string)|(?<bool>bool)|(?<type>\w+))(?<arr2>\[\])?(>)?(?<arr3>\[\])? (?<name>\w+) (.+)/gm,
    //   (match, $arr1, $gen, $num, $str, $bool, $type, $arr2, $arr3, $name) => {
    //     debugger;
    //     return ""
    //   });
  }
}
