import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { timer } from 'rxjs';
import { ApiService } from '../../api/api.service';
import { Lobby } from '../../api/stages/lobby.model';
import { GoogleMapsService } from '../../google-maps.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { LinkButtonComponent } from '../../shared/link-button/link-button.component';
import { PlayerAvatarComponent } from '../../shared/player-avatar/player-avatar.component';
import { SecondaryButtonComponent } from '../../shared/secondary-button/secondary-button.component';

@Component({
  selector: 'app-lobby',
  imports: [
    ButtonComponent,
    LinkButtonComponent,
    SecondaryButtonComponent,
    PlayerAvatarComponent,
  ],
  templateUrl: './lobby.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) lobby!: Lobby;

  @ViewChild('previewMap', { read: ElementRef })
  previewMap: ElementRef<HTMLElement> | undefined;

  linkCopied = false;

  constructor(
    private readonly googleMapsService: GoogleMapsService,
    private readonly apiService: ApiService,
    private readonly changeDetectorRef: ChangeDetectorRef,
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

  copyLink(): void {
    window.navigator.clipboard.writeText(window.location.href);
    this.linkCopied = true;

    timer(2000).subscribe(() => {
      this.linkCopied = false;
      this.changeDetectorRef.markForCheck();
    });
  }
}
