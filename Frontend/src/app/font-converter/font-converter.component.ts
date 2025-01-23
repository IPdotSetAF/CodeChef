import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Font, woff2 } from 'fonteditor-core';
import { BytesPipe } from '../../pipes/bytes/bytes.pipe';
import { JoinPipe } from '../../pipes/join/join.pipe';
import { downloadFile, downloadFilesAsZip } from '../../utils/download';

@Component({
  selector: 'app-font-converter',
  standalone: true,
  imports: [FormsModule, BytesPipe, JoinPipe],
  templateUrl: './font-converter.component.html',
  styleUrl: './font-converter.component.css'
})
export class FontConverterComponent {
  protected files: FontFile[] = [];
  protected isDragOver: boolean = false;
  protected fromExtensions: string[] = ['ttf', 'woff', 'woff2', 'eot', 'svg', 'otf'];
  protected toExtensions: string[] = ['ttf', 'woff', 'woff2', 'eot', 'svg'];
  protected selectedFormat: string = this.fromExtensions[0];
  protected isConverted: boolean = false;

  protected downloadFile = downloadFile;

  protected onFileSelected(event: any): void {
    const selectedFiles = event.target.files;
    this.addFiles(selectedFiles);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      this.addFiles(droppedFiles);
    }
  }

  private addFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isValidFontFile(file)) {
        this.files.push({ originalFile: file, convertedFile: null });
      } else {
        alert(`File "${file.name}" is not a valid font file.`);
      }
    }
    this.isConverted = false;
  }

  protected removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  private isValidFontFile(file: File): boolean {
    const extension = file.name.split('.').pop()!.toLowerCase();
    return this.fromExtensions.includes(extension);
  }

  protected onFormatChanged() {
    this.isConverted = false;
    for (let fileObj of this.files) {
      fileObj.convertedFile = null;
    }
  }

  protected async convert() {
    this.isConverted = false;

    await woff2.init('/woff2/woff2.wasm');

    for (let fileObj of this.files) {
      const arrayBuffer = await fileObj.originalFile.arrayBuffer();
      const font = Font.create(arrayBuffer, {
        type: fileObj.originalFile.name.split('.').pop() as any,
        hinting: true,
        kerning: true,
      });

      const buffer = font.write({
        type: this.selectedFormat as any,
        toBuffer: true,
        hinting: true,
      });

      const blob = new Blob([buffer], { type: this.getMimeType(this.selectedFormat) });
      fileObj.convertedFile = new File([blob], fileObj.originalFile.name.replace(/\.\w+$/, `.${this.selectedFormat}`));
    }

    this.isConverted = true;
  }

  private getMimeType(extension: string): string {
    if (extension === 'svg')
      return 'image/svg+xml';
    if (this.toExtensions.includes(extension))
      return 'font/' + extension;
    return 'application/octet-stream';
  }

  protected downloadAll() {
    downloadFilesAsZip(this.files.map(file => file.convertedFile!), 'converted-fonts.zip');
  }
}

interface FontFile {
  originalFile: File;
  convertedFile?: File | null;
}