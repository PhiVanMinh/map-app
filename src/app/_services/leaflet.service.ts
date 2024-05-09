import { Injectable, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { MapOptions } from 'leaflet';
import 'leaflet-fullscreen';
import 'leaflet-draw';
import 'leaflet.markercluster';
import { isArray } from 'ngx-bootstrap/chronos';
import { Vehicle } from '../_models/vehicle';

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

  private markers: { [id: string]: L.Marker } = {};
  marker!: L.Marker;
  hideClusterIcon: boolean = false;
  vehicleGroupLayer: L.MarkerClusterGroup;
  curentVehicleId!: number;

  vehicleLayer: L.LayerGroup = new L.LayerGroup();

  constructor() {
    this.vehicleGroupLayer = this.createClusterGroup();
  }
    ngOnDestroy(): void {
    }

  initMap(id: string): void {
    this.map = L.map(id, {
      center: [ 21.0227784, 105.8163641],
      zoom: 15,
      zoomControl: false
    });

    L.control.zoom({
      position: 'topright' // Đặt vị trí nút zoom ở góc phải trên
    }).addTo(this.map);

      const tiles = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi-vn', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Vệ tinh Google',
      /** False: Tăng hiệu suất load ảnh nền; True: ảnh nền độ chi tiết cao */
      detectRetina: true,
      maxZoom: 22,
      minZoom: 5,
    });

    tiles.addTo(this.map);
    this.vehicleLayer?.addTo(this.map);
    this.vehicleGroupLayer?.addTo(this.map);
  }

  updateIconMarker(marker: L.Marker, vehicle: Vehicle, rotationDeg: number ,isCurrent?: boolean){
    marker.setIcon(this.createIcon({
        iconSize: [25, 25],
        iconAnchor: [15, 15],
        iconUrl: '/assets/images/vehicle/car/Blue0.png',
        className: isCurrent ? 'marker-icon-vehicle-selected' : 'marker-icon-vehicle',
        labelContent: vehicle.privateCode,
        rotationDeg: rotationDeg,
    }))
  }

  public addMarker(id: string, lat: number, lng: number, options: L.MarkerOptions, isCurrent?: boolean): void {
      if (options.iconOptions) {
        options.icon = this.createIcon(options.iconOptions);
    }
    const marker = L.marker([lat, lng], options);
    if (options.popupContent) {
      options.popupClass = options.popupClass ?? 'custom-popup';
      options.popupMinWidth = options.popupMinWidth ?? 50;
      options.popupMaxWidth = options.popupMaxWidth ?? 500;
      options.popupOffset = options.popupOffset ?? undefined;
      marker.bindPopup(options.popupContent, { className: options.popupClass, minWidth: options.popupMinWidth, maxWidth: options.popupMaxWidth, offset: options.popupOffset });
    }
     //marker.bindPopup(id); // Example: Add a popup with marker ID
    this.markers[id] = marker; // Store marker reference with ID
    if(isCurrent) this.vehicleLayer.addLayer(marker)
    else this.vehicleGroupLayer.addLayer(marker);
  }

  public getMarkerById(id: string): L.Marker {
    const selectedMarker = this.markers[id];
    this.vehicleGroupLayer.removeLayer(selectedMarker);
    return this.markers[id]; // Retrieve marker by ID
  }
  public moveMarkerTo(newLat: number, newLng: number): void {
    const startLatLng = this.marker.getLatLng();
    const stepLat = (newLat - startLatLng.lat) / 100; // Tính toán bước di chuyển
    const stepLng = (newLng - startLatLng.lng) / 100;

    this.moveMarkerStep(startLatLng.lat, startLatLng.lng, newLat, newLng, stepLat, stepLng, 0);
  }

  private moveMarkerStep(startLat: number, startLng: number, newLat: number, newLng: number, stepLat: number, stepLng: number, count: number): void {
    if (count < 100) {
      const lat = startLat + (stepLat * count);
      const lng = startLng + (stepLng * count);
      this.marker.setLatLng([lat, lng]);

      count++;
      setTimeout(() => {
        this.moveMarkerStep(startLat, startLng, newLat, newLng, stepLat, stepLng, count);
      }, 10); // Thời gian delay (milliseconds) giữa các bước di chuyển
    }
  }

  createClusterGroup(options?: L.MarkerClusterGroupOptions): L.MarkerClusterGroup {
    // Đặt các giá trị mặc định
    options = options ?? {};
    options.hideClusterIcon = options.hideClusterIcon ?? false;
    options.chunkedLoading = options.chunkedLoading ?? true;

    if (!options.hideClusterIcon) {
      options.iconHtml = options.iconHtml ?? '<i class=\"bi bi-car-front-fill\"></i>';
        options.iconCreateFunction = (cluster) => {
            let classGroupSmall: string;
            const count = cluster.getChildCount();
            if (count <= 10) {
                classGroupSmall = 'cluster-group-level-1';
            }
            else if (count <= 50) {
                classGroupSmall = 'cluster-group-level-2';
            }
            else if (count <= 100) {
                classGroupSmall = 'cluster-group-level-3';
            }
            else {
                classGroupSmall = 'cluster-group-level-4';
            }

            const html = `
            <div class="cluster-group ${classGroupSmall}">
                <span class="text-group">${count}</span>
                ${options?.iconHtml}
            </div>
                `;
            return L.divIcon({ html, className: 'custom-cluster-group' });
        };
    }
    else {
        options.iconCreateFunction = () => {
            return L.divIcon({ html: '', className: 'd-none' });
        };
    }

    return L.markerClusterGroup(options);
}

// Hàm để sinh ra một vị trí latlng ngẫu nhiên cách một khoảng cách xác định từ vị trí hiện tại
 generateRandomLatLng(currentLatLng: L.LatLng, distance: number): L.LatLng {
  // Chuyển đổi độ sang radian
  const currentLatRad = currentLatLng.lat * Math.PI / 180;
  const currentLngRad = currentLatLng.lng * Math.PI / 180;

  // Bán kính trái đất ở đơn vị kilometer
  const earthRadius = 6371; // in kilometers

  // Tính toán hướng ngẫu nhiên (từ 0 đến 2*PI)
  const randomDirection = Math.random() * 2 * Math.PI;

  // Tính toán vị trí mới dựa trên hướng và khoảng cách
  const newLatRad = Math.asin(Math.sin(currentLatRad) * Math.cos(distance / earthRadius) +
                  Math.cos(currentLatRad) * Math.sin(distance / earthRadius) * Math.cos(randomDirection));
  const newLngRad = currentLngRad + Math.atan2(Math.sin(randomDirection) * Math.sin(distance / earthRadius) * Math.cos(currentLatRad),
                  Math.cos(distance / earthRadius) - Math.sin(currentLatRad) * Math.sin(newLatRad));

  // Chuyển đổi kết quả từ radian sang độ
  const newLat = newLatRad * 180 / Math.PI;
  const newLng = newLngRad * 180 / Math.PI;

  // Trả về vị trí latlng mới
  return L.latLng(newLat, newLng);
}

    /**
     * Tạo icon cho marker với các thuộc tính nâng cao
     * @param options Thuộc tính icon
     */
  createIcon(options: L.DivIconOptions) {
    // Gán giá trị mặc định nếu ko có
    options.iconSize = isArray(options.iconSize) && options.iconSize?.length > 0 ? options.iconSize : [32, 32];
    options.iconAnchor = options.iconAnchor ?? [16, 32];
    options.className = options.className ?? 'custom-marker-icon';

    let html = '';
    if (options.labelContent) {
        html += `<label>${options.labelContent}</label>`;
    }

    const transformText = options.rotationDeg ? ` transform: rotate(${options.rotationDeg}deg)${options.flipX ? ' scaleX(-1)' : ''}${options.flipY ? ' scaleY(-1)' : ''};` : '';

    if (options.fontAwesomeClass) {
        html += `<i class="${options.fontAwesomeClass}" style="max-width:${options.iconSize[0]}px !important; max-height:${options.iconSize[1]}px !important; font-size: ${options.iconSize[0]}px !important; ${options.fontAwesomeColor ? 'color:' + options.fontAwesomeColor + ';' : ''}${transformText}"></i>`;
    }
    else {
        if (options.iconUrl) {
            html += `<img src="${options.iconUrl}" style="max-width:${options.iconSize[0]}px !important; max-height:${options.iconSize[1]}px !important;${transformText}"/>`;
        }
    }

    options.html = html;

    return new L.DivIcon(options);
  }

      /** Tính hướng xoay. Trả về số Deg (Độ) */
  computeDirection(fromLat: number, fromLng: number, toLat: number, toLng: number) {
    const fromLatRadian = this.toRadians(fromLat);
    const fromLngRadian = this.toRadians(fromLng);
    const toLatRadian = this.toRadians(toLat);
    const toLngRadian = this.toRadians(toLng);

    const heading: number = Math.atan2(toLngRadian - fromLngRadian, toLatRadian - fromLatRadian);
    let angleDeg = Math.ceil(heading * 180 / Math.PI);
    if (angleDeg < 0) {
        angleDeg += 360;
    }
    return angleDeg;
  }

  toRadians(angdeg: number): number {
    return (angdeg / 180.0) * Math.PI;
  }

}

