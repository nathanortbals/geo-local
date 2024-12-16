import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number',
})
export class NumberPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '';
    }

    const formattedNumber = new Intl.NumberFormat('en-US').format(
      Number(value),
    );

    return formattedNumber;
  }
}
