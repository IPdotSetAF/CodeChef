import { Component } from '@angular/core';
import { CodeAreaComponent } from "../code-area/code-area.component";
import { valueChangeAnim } from '../../animations/common-animations';
import { Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import {nanoid} from 'nanoid';

@Component({
  selector: 'app-id-generator',
  standalone: true,
  imports: [FormsModule, CodeAreaComponent],
  templateUrl: './id-generator.component.html',
  animations: [valueChangeAnim]
})
export class IdGeneratorComponent  {
  protected status: boolean = false;
  protected idsCode: string = "";
  protected isGuid: boolean = true;
  protected uppercase: boolean = false;
  protected hyphen: boolean = true;
  protected base64: boolean = false;
  // protected rfc7515: boolean = false;
  protected urlEncode: boolean = false;
  protected count: number = 7;
  protected prepend: string = "{\"";
  protected append: string = "\"},";

  constructor(meta: Meta) {
    meta.addTags([
      { name: "description", content: "Generates GUID/UUID or NanoIDs with advanced settings." },
      { name: "keywords", content: "generate, generator, ID, GUID, UUID, nanoID, free, online, advanced, setting, code, encode, encoder, encoding, base64, base, 64, url, url encode, RFC7515, RFC, 7515" },
    ]);

    this.generate();
  }

  protected generate() {
    this.idsCode = "";
    for (let i = 0; i < this.count; i++) {
      let id = this.isGuid? uuidv4().toString() : nanoid().toString();
      if (this.uppercase) id = id.toUpperCase();
      if (this.isGuid) if (!this.hyphen) id = id.replaceAll("-", "");
      if (this.base64) id = btoa(id);
      // if (this.rfc7515) id = id.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      if (this.base64) if (this.urlEncode) id = encodeURIComponent(id);
      this.idsCode += this.prepend + id + this.append + "\n";
    }

    this.status = !this.status;
  }
}
