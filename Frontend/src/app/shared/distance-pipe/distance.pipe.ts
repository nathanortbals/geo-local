import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
})
export class DistancePipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '';
    }

    const distanceInMeters = Number(value);

    if (distanceInMeters >= 1000) {
      const distanceInKilometers = Math.floor(distanceInMeters / 1000);
      return `${distanceInKilometers} km`;
    }

    return `${Math.floor(distanceInMeters)} m`;
  }
}
