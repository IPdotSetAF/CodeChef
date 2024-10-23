import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeLast, tap } from 'rxjs';
import { CodeAreaComponent } from '../code-area/code-area.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BrowserModule } from '@angular/platform-browser';
import { query } from 'express';

@Component({
  selector: 'app-cs2ts',
  standalone: true,
  imports: [FormsModule, CodeAreaComponent],
  templateUrl: './cs2ts.component.html',
  styleUrl: './cs2ts.component.css',
  animations: [
    trigger('valueChangeAnim', [
      state('*', style({ "border-width": "3px" })),
      transition('* <=> *', [
        animate('0.15s ease-in', style({ "border-color": "green" })),
        animate('0.15s ease-out', style({ "border-color": "transparent" }))
      ]),
    ])
  ]
})
export class Cs2tsComponent implements AfterContentInit {
  @ViewChild("csCode", { read: ElementRef })
  protected csCode!: ElementRef<HTMLInputElement>;
  @ViewChild("tsCode", { read: ElementRef })
  protected tsCode!: ElementRef<HTMLInputElement>;

  protected csModel: string = `public int x1 {get;set;}
public float x2 {get;set;}
public double x3 {get;set;}
public decimal x4 {get;set;}
public string x5 {get;set;}
public bool x6 {get;set;}
public Hello x7 {get;set;}
public int[] x8 {get;set;}
public long[] x9 {get;set;}
public IEnumerable<string> x10 {get;set;}
public List<bool> x11 {get;set;}
public ICollection<Hello> x12 {get;set;}
public Hello<Hello> x13 {get;set;}
public Hello<int> x14 {get;set;}
public Hello<long[]> x15 {get;set;}
public Hello<float>[] x16 {get;set;}`;
  protected tsModel !: string;
  protected regexModel !: string;
  protected status: boolean = false;

  protected inputDebouncer = new Subject<string>();

  ngAfterContentInit(): void {
    this.inputDebouncer.pipe(
      debounceTime(500),
      tap(value => this.convert(value)),
      takeLast(1),
    ).subscribe();

    this.convert(this.csModel);
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

    this.tsModel = value.replaceAll(/public (?<type>\w+)(?<gen1><(?<gen2>\w+)(?<arr1>\[\])*>)*(?<arr2>\[\])*(?<nul>\?)* (?<name>\w+) (.*)/gm,
      (match, type, gen1, gen2, arr1, arr2, nul, name) => {
        switch (type) {
          case "List":
          case "IEnumerable":
          case "ICollection":
            arr2 = "[]";
            type = gen2;
            gen1 = undefined;
            gen2 = undefined;
        }

        type = Cs2tsComponent.convertTypes(type);
        gen2 = Cs2tsComponent.convertTypes(gen2);

        return `${name} ${nul?nul:""}: ${type}${gen2 ? "<" + gen2 + (arr1 ? arr1 : "") + ">" : ""}${arr2 ? arr2 : ""}${nul?" | null":""} ;`;
      });

    // try {
    //   this.tsModel = value.replaceAll(RegExp(this.regexModel, "gm"),
    //     (match, type, gen1, gen2, arr1, arr2, name) => {
    //       debugger;
    //       return `${type} : ${gen1} : ${gen2} : ${arr1} : ${arr2} : ${name}`;
    //     });
    // } catch {
    //   this.tsModel = "";
    // }

    this.status = !this.status;
  }

  private static convertTypes(a :string|undefined): string|undefined{
    if (a === "bool")
      return "boolean";

    switch (a) {
      case "int":
      case "float":
      case "double":
      case "decimal":
      case "long":
        return "number";
    }

    return a;
  }
}
