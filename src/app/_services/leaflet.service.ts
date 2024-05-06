import { Injectable, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { MapOptions } from 'leaflet';

@Injectable({
  providedIn: 'root'
})

export class LeafletService implements OnDestroy  {

  /** Đối tượng bản đồ */
  map!: L.Map;
  private mapOptions!: MapOptions;
  /** Control danh sách ảnh nền */
  protected tileLayersControl!: L.Control.Layers;
  /** Đối tượng chứa danh sách ảnh nền */
  protected tileLayerObjects: { [name: string]: L.TileLayer } = {};

  constructor() { }
    ngOnDestroy(): void {
    }

  /** Tạo danh sách ảnh nền bản đồ */
  // private getTileLayerObjects() {
  //   const listMapTileUrls: { titleKey: string; imageUrl: string }[] = [
  //     { titleKey: 'Bản đồ Google', imageUrl: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi-vn'},
  //     { titleKey: 'Vệ tinh Google', imageUrl: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi-vn'}
  //   ];

  //   let tileLayerObjects = Object.assign({});

  //   for (const tileObject of listMapTileUrls) {
  //     const translateText: string = tileObject.titleKey;
  //     const tileLayer = this.createTileLayer(translateText, tileObject.imageUrl);
  //     tileLayerObjects[translateText] = tileLayer;
  //   }

  //   return tileLayerObjects;
  // }

  // protected createTileLayer(name: string, url: string, zIndex?: number) {
  //   let tile: L.TileLayer;
  //   if (name && url) {
  //     tile = L.tileLayer(url, {
  //       subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  //       attribution: name,
  //       maxZoom: this.map.getMaxZoom() + 1,
  //       /** False: Tăng hiệu suất load ảnh nền; True: ảnh nền độ chi tiết cao */
  //       detectRetina: true,
  //       zIndex: zIndex
  //     });
  //   }

  //   return tile;
  // }

  initMap(): void {
    this.map = L.map('map', {
      center: [ 21.0227784, 105.8163641],
      zoom: 15
    });

    // const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   minZoom: 3,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // });

      const tiles = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi-vn', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Vệ tinh Google',
      /** False: Tăng hiệu suất load ảnh nền; True: ảnh nền độ chi tiết cao */
      detectRetina: true,
      maxZoom: 22,
      minZoom: 5,
    });

    tiles.addTo(this.map);
  }

}

