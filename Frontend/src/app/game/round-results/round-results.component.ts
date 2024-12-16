import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../api/api.service';
import { RoundResults } from '../../api/stages/round-results.model';
import { GoogleMapsService } from '../../google-maps.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { DistancePipe } from '../../shared/distance-pipe/distance.pipe';
import { NumberPipe } from '../../shared/number-pipe/number.pipe';

@Component({
  selector: 'app-round-results',
  imports: [ButtonComponent, NumberPipe, DistancePipe],
  templateUrl: './round-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundResultsComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) roundResults!: RoundResults;

  @ViewChild('map', { read: ElementRef })
  map: ElementRef<HTMLElement> | undefined;

  constructor(
    private readonly googleMapsService: GoogleMapsService,
    private readonly apiService: ApiService,
  ) {}

  ngOnChanges(): void {
    this.createMap();
  }

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

    const guess = this.roundResults.guess
      ? {
          lat: this.roundResults.guess.latitude,
          lng: this.roundResults.guess.longitude,
        }
      : null;

    if (guess) {
      this.googleMapsService.createPin({
        map,
        position: guess,
      });
    }

    const location = {
      lat: this.roundResults.location.latitude,
      lng: this.roundResults.location.longitude,
    };
    const imageElement = document.createElement('img');
    imageElement.src = '/location.svg';
    imageElement.style.height = '30px';
    imageElement.style.width = '30px';
    imageElement.style.transform = 'translateY(50%)';
    this.googleMapsService.createMarker({
      map,
      position: location,
      content: imageElement,
    });

    if (guess) {
      map.fitBounds({
        east: Math.max(location.lng, guess.lng),
        west: Math.min(location.lng, guess.lng),
        north: Math.max(location.lat, guess.lat),
        south: Math.min(location.lat, guess.lat),
      });

      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 3,
      };
      new google.maps.Polyline({
        path: [
          { lat: location.lat, lng: location.lng },
          { lat: guess.lat, lng: guess.lng },
        ],
        strokeColor: '#000000',
        geodesic: true,
        strokeOpacity: 0,
        strokeWeight: 2,
        icons: [
          {
            icon: lineSymbol,
            offset: '0',
            repeat: '20px',
          },
        ],
        map: map,
      });
    } else {
      map.setCenter(location);
      map.setZoom(15);
    }
  }

  showFinalResults() {
    this.apiService.showFinalResults(this.roundResults.gameId);
  }

  startNextRound() {
    this.apiService.startNextRound(
      this.roundResults.gameId,
      this.roundResults.roundNumber + 1,
    );
  }
}
