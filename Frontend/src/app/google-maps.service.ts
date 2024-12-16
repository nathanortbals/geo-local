import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  mapsLibrary: google.maps.MapsLibrary | null = null;
  markerLibrary: google.maps.MarkerLibrary | null = null;
  streetViewLibrary: google.maps.StreetViewLibrary | null = null;

  apiKey = 'AIzaSyAkZ3tpikWBVrfGG_HBxiUh9dlmWoYLZis';
  mapId = 'f875757694dd46a2';

  async loadLibraries(): Promise<void> {
    const loader = new Loader({
      apiKey: this.apiKey,
    });

    this.mapsLibrary = await loader.importLibrary('maps');
    this.markerLibrary = await loader.importLibrary('marker');
    this.streetViewLibrary = await loader.importLibrary('streetView');
  }

  createMap(
    element: HTMLElement,
    options: google.maps.MapOptions,
  ): google.maps.Map {
    if (!this.mapsLibrary) {
      throw new Error('Google Maps library not loaded');
    }

    return new this.mapsLibrary.Map(element, { ...options, mapId: this.mapId });
  }

  createPin(
    options: google.maps.marker.AdvancedMarkerElementOptions,
  ): google.maps.marker.AdvancedMarkerElement {
    if (!this.markerLibrary) {
      throw new Error('Google Marker library not loaded');
    }

    const pin = new this.markerLibrary.PinElement();
    return new google.maps.marker.AdvancedMarkerElement({
      ...options,
      content: pin.element,
    });
  }

  createMarker(
    options: google.maps.marker.AdvancedMarkerElementOptions,
  ): google.maps.marker.AdvancedMarkerElement {
    if (!this.markerLibrary) {
      throw new Error('Google Marker library not loaded');
    }

    return new this.markerLibrary.AdvancedMarkerElement(options);
  }

  createStreetView(
    element: HTMLElement,
    options: google.maps.StreetViewPanoramaOptions,
  ): google.maps.StreetViewPanorama {
    if (!this.streetViewLibrary) {
      throw new Error('Google Street View library not loaded');
    }

    return new this.streetViewLibrary.StreetViewPanorama(element, options);
  }
}
