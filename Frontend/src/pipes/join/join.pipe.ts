import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
  pure: true,
  standalone: true
})
export class JoinPipe implements PipeTransform {

  transform(value: any[], delimiter: string): unknown {
    return value.join(delimiter);
  }

}
