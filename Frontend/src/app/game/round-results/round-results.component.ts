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
import {
  PlayerRoundResults,
  RoundResults,
} from '../../api/stages/round-results.model';
import { GoogleMapsService } from '../../google-maps.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { DistancePipe } from '../../shared/distance-pipe/distance.pipe';
import { DomService } from '../../shared/dom.service';
import { LogoComponent } from '../../shared/logo/logo.component';
import { NumberPipe } from '../../shared/number-pipe/number.pipe';
import { PlayerAvatarComponent } from '../../shared/player-avatar/player-avatar.component';

@Component({
  selector: 'app-round-results',
  imports: [
    ButtonComponent,
    NumberPipe,
    DistancePipe,
    PlayerAvatarComponent,
    LogoComponent,
  ],
  templateUrl: './round-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundResultsComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) roundResults!: RoundResults;
  @Input({ required: true }) playerName!: string;

  @ViewChild('map', { read: ElementRef })
  map: ElementRef<HTMLElement> | undefined;

  myRoundResults: PlayerRoundResults | undefined;

  loading = false;
  isHost = false;

  constructor(
    private readonly googleMapsService: GoogleMapsService,
    private readonly apiService: ApiService,
    private readonly domService: DomService,
  ) {}

  ngOnChanges(): void {
    this.createMap();

    this.myRoundResults = this.roundResults.players.find(
      (player) => player.playerName === this.apiService.playerName,
    );

    this.isHost =
      this.roundResults.players.find((p) => p.playerName == this.playerName)
        ?.isHost ?? false;
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

    this.drawTarget(map);

    this.roundResults.players.forEach((player) => {
      this.drawGuess(map, player);
    });

    this.fitMapToGuesses(map);
  }

  drawTarget(map: google.maps.Map) {
    const target = {
      lat: this.roundResults.target.latitude,
      lng: this.roundResults.target.longitude,
    };

    this.googleMapsService.createPin({
      map,
      position: target,
    });
  }

  drawGuess(map: google.maps.Map, playerResults: PlayerRoundResults) {
    if (!playerResults.guess) {
      return;
    }

    const guess = {
      lat: playerResults.guess.latitude,
      lng: playerResults.guess.longitude,
    };

    const target = {
      lat: this.roundResults.target.latitude,
      lng: this.roundResults.target.longitude,
    };

    const playerMaker = this.domService.createComponent(PlayerAvatarComponent, {
      name: playerResults.playerName,
      color: playerResults.playerColor,
    });
    playerMaker.style.display = 'block';
    playerMaker.style.transform = 'translateY(50%)'; // Adjust this value for centering the component
    this.googleMapsService.createMarker({
      map,
      position: guess,
      content: playerMaker,
    });

    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 3,
    };
    new google.maps.Polyline({
      path: [
        { lat: target.lat, lng: target.lng },
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
  }

  fitMapToGuesses(map: google.maps.Map) {
    const bounds = new google.maps.LatLngBounds();

    bounds.extend({
      lat: this.roundResults.target.latitude,
      lng: this.roundResults.target.longitude,
    });

    this.roundResults.players.forEach((player) => {
      if (player.guess) {
        bounds.extend({
          lat: player.guess.latitude,
          lng: player.guess.longitude,
        });
      }
    });

    map.fitBounds(bounds);
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
