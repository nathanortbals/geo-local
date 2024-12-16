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
import { Lobby } from '../../api/stages/lobby.model';
import { GoogleMapsService } from '../../google-maps.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { LinkButtonComponent } from '../../shared/link-button/link-button.component';

@Component({
  selector: 'app-lobby',
  imports: [ButtonComponent, LinkButtonComponent],
  templateUrl: './lobby.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) lobby!: Lobby;

  @ViewChild('previewMap', { read: ElementRef })
  previewMap: ElementRef<HTMLElement> | undefined;

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

  createMap(): void {
    if (!this.previewMap || !this.lobby) {
      return;
    }

    const map = this.googleMapsService.createMap(
      this.previewMap.nativeElement,
      {
        disableDefaultUI: true,
        gestureHandling: 'none',
        zoomControl: false,
      },
    );

    const circle = new google.maps.Circle({
      strokeOpacity: 0.5,
      strokeWeight: 0.75,
      fillColor: '#FEE12B',
      fillOpacity: 0.35,
      map,
      center: {
        lat: this.lobby.bounds.center.latitude,
        lng: this.lobby.bounds.center.longitude,
      },
      radius: this.lobby.bounds.radiusInMeters,
    });

    const bounds = circle.getBounds();
    if (bounds) {
      map.fitBounds(bounds);
    }
  }

  startGame(): void {
    this.apiService.startGame(this.lobby.gameId);
  }
}
