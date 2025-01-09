import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Coordinates } from '../../../api/models/coordinates.model';
import { GoogleMapsService } from '../../../google-maps.service';
import { LogoComponent } from '../../../shared/logo/logo.component';

@Component({
  selector: 'app-finalized-guess',
  imports: [LogoComponent],
  templateUrl: './finalized-guess.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalizedGuessComponent implements AfterViewInit {
  @Input({ required: true }) coordinates!: Coordinates;

  @ViewChild('map', { read: ElementRef })
  map: ElementRef<HTMLElement> | undefined;

  constructor(private readonly googleMapsService: GoogleMapsService) {}

  ngAfterViewInit(): void {
    this.createMap();
  }

  createMap() {
    if (!this.map) {
      return;
    }

    const map = this.googleMapsService.createMap(this.map.nativeElement, {
      disableDefaultUI: true,
    });

    this.googleMapsService.createMarker({
      position: {
        lat: this.coordinates.latitude,
        lng: this.coordinates.longitude,
      },
      map,
    });

    map.setCenter({
      lat: this.coordinates.latitude,
      lng: this.coordinates.longitude,
    });
    map.setZoom(14);
  }
}
