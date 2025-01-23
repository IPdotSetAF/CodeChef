import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytes',
  pure: true,
  standalone: true
})
export class BytesPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

}
