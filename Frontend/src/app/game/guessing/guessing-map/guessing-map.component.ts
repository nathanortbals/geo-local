import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from '../../../api/models/coordinates.model';
import { Guessing } from '../../../api/stages/guessing.model';
import { GoogleMapsService } from '../../../google-maps.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TimePipe } from '../../../shared/time-pipe/time.pipe';
import { createTimer } from '../../../shared/timer';

@Component({
  selector: 'app-guessing-map',
  imports: [AsyncPipe, TimePipe, ButtonComponent],
  templateUrl: './guessing-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuessingMapComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) guessing!: Guessing;
  @Output() readonly guessUpdated = new EventEmitter<Coordinates>();
  @Output() readonly guessFinalized = new EventEmitter<void>();

  @ViewChild('streetView', { read: ElementRef })
  streetViewContainer: ElementRef<HTMLElement> | undefined;

  @ViewChild('map', { read: ElementRef })
  mapContainer: ElementRef<HTMLElement> | undefined;

  currentMarker: google.maps.marker.AdvancedMarkerElement | null = null;

  timer$: Observable<number> | undefined;

  streetView: google.maps.StreetViewPanorama | undefined;

  constructor(private readonly googleMapsService: GoogleMapsService) {}

  ngOnInit(): void {
    this.timer$ = createTimer(new Date(this.guessing.roundEndsAt));
  }

  ngAfterViewInit(): void {
    if (!this.streetViewContainer || !this.mapContainer) {
      return;
    }

    this.streetView = this.googleMapsService.createStreetView(
      this.streetViewContainer.nativeElement,
      {
        position: {
          lat: this.guessing.location.latitude,
          lng: this.guessing.location.longitude,
        },
        showRoadLabels: false,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
      },
    );

    const map = this.googleMapsService.createMap(
      this.mapContainer.nativeElement,
      {
        disableDefaultUI: true,
        clickableIcons: false,
        draggableCursor: 'crosshair',
      },
    );

    this.drawMapBounds(map);

    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (this.currentMarker) {
        this.currentMarker.map = null;
      }

      this.currentMarker = this.googleMapsService.createPin({
        position: event.latLng,
        map,
      });

      if (event.latLng) {
        const coordinates = {
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        };

        this.guessUpdated.emit(coordinates);
      }
    });
  }

  calculateProgress(remainingTime: number): number {
    const progress =
      ((this.guessing.timeLimitSeconds - remainingTime) /
        this.guessing.timeLimitSeconds) *
      100;

    return progress;
  }

  submitGuess() {
    this.guessFinalized.emit();
  }

  returnToStart() {
    if (this.streetView) {
      this.streetView.setPosition({
        lat: this.guessing.location.latitude,
        lng: this.guessing.location.longitude,
      });
    }
  }

  private drawMapBounds(map: google.maps.Map) {
    map.data.addGeoJson(this.guessing.bounds.outsideArea);
    map.data.setStyle({
      strokeColor: '#000000',
      strokeOpacity: 0,
      strokeWeight: 0,
      fillColor: '#000000',
      fillOpacity: 0.3,
    });

    map.fitBounds(
      {
        north: this.guessing.bounds.boundingBox.maxLatitude,
        south: this.guessing.bounds.boundingBox.minLatitude,
        east: this.guessing.bounds.boundingBox.maxLongitude,
        west: this.guessing.bounds.boundingBox.minLongitude,
      },
      0,
    );
  }
}
