import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(meta:Meta){
    meta.addTags([
      {name: "description", content:"Developer utilities that automate simple and boring tasks, converts codes and more."},
      {name: "keywords", content:"Developer, automation, utility, programmer, programming, coding, convert, conversion, converter, language"},
    ]);
  }
}
