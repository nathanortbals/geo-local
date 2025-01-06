import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/api.service';
import { Guessing } from '../../api/stages/guessing.model';
import { GoogleMapsService } from '../../google-maps.service';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { TimePipe } from '../../shared/time-pipe/time.pipe';
import { createTimer } from '../../shared/timer';

@Component({
  selector: 'app-guessing',
  imports: [AsyncPipe, ProgressBarComponent, TimePipe],
  templateUrl: './guessing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuessingComponent implements AfterViewInit, OnInit {
  @Input({ required: true }) guessing!: Guessing;

  @ViewChild('streetView', { read: ElementRef })
  streetView: ElementRef<HTMLElement> | undefined;

  @ViewChild('map', { read: ElementRef })
  map: ElementRef<HTMLElement> | undefined;

  currentMarker: google.maps.marker.AdvancedMarkerElement | null = null;

  targetTime!: Date;
  timer$: Observable<number> | undefined;

  constructor(
    private readonly googleMapsService: GoogleMapsService,
    private readonly apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.targetTime = new Date(this.guessing.roundEndsAt);
    this.timer$ = createTimer(this.targetTime);
  }

  ngAfterViewInit(): void {
    if (!this.streetView || !this.map) {
      return;
    }

    this.googleMapsService.createStreetView(this.streetView.nativeElement, {
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
    });

    const map = this.googleMapsService.createMap(this.map.nativeElement, {
      disableDefaultUI: true,
      clickableIcons: false,
      draggableCursor: 'crosshair',
    });

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
        this.apiService.submitGuess(
          this.guessing.gameId,
          this.guessing.roundNumber,
          {
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          },
        );
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
