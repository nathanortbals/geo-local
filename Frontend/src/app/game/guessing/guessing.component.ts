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

    this.drawMapCircle(map);

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

  private drawMapCircle(map: google.maps.Map) {
    // Define the circle center and radius (in meters)
    const circleCenter = {
      lat: this.guessing.bounds.center.latitude,
      lng: this.guessing.bounds.center.longitude,
    };
    const circleRadius = this.guessing.bounds.radiusInMeters;

    // Define the outer bounds of the map as a large rectangle
    const outerBounds = [
      new google.maps.LatLng(85, 180),
      new google.maps.LatLng(85, 90),
      new google.maps.LatLng(85, 0),
      new google.maps.LatLng(85, -90),
      new google.maps.LatLng(85, -180),
      new google.maps.LatLng(0, -180),
      new google.maps.LatLng(-85, -180),
      new google.maps.LatLng(-85, -90),
      new google.maps.LatLng(-85, 0),
      new google.maps.LatLng(-85, 90),
      new google.maps.LatLng(-85, 180),
      new google.maps.LatLng(0, 180),
      new google.maps.LatLng(85, 180),
    ];

    // Get the circle's path as a set of LatLng points
    const circlePath = [];
    const bounds = new google.maps.LatLngBounds();
    const numPoints = 100; // Number of points to define the circle
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 360; // Angle in degrees
      const point = google.maps.geometry.spherical.computeOffset(
        circleCenter,
        circleRadius,
        angle,
      );
      circlePath.push(point);
      bounds.extend(point);
    }

    // Create a polygon with the outer bounds and the reversed circle path as a hole
    new google.maps.Polygon({
      paths: [outerBounds, circlePath], // Outer bounds first, reversed circle path as a hole
      strokeColor: '#000000',
      strokeOpacity: 0,
      strokeWeight: 0,
      fillColor: '#000000',
      fillOpacity: 0.3, // Adjust opacity for greyed-out effect
      map: map,
    });

    map.fitBounds(bounds, 0);
  }
}
