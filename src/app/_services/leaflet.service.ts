import { Injectable, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import * as L from 'leaflet';
import { FeatureGroup, MapOptions } from 'leaflet';
import 'leaflet-fullscreen';
import 'leaflet-draw';
import 'leaflet.markercluster';
import { isArray } from 'ngx-bootstrap/chronos';
import { Vehicle } from '../_models/vehicle';
import * as moment from 'moment';
import { Landmark } from '../_models/landmark/landmark.model';
import 'leaflet-contextmenu';

@Injectable({
  providedIn: 'root'
})

export class LeafletService implements OnDestroy  {

  /** Đối tượng bản đồ */
  map!: L.Map;
  private mapOptions!: MapOptions;
  private baseMaps: any;
  /** Control danh sách ảnh nền */
  protected tileLayersControl!: L.Control.Layers;
  /** Đối tượng chứa danh sách ảnh nền */
  protected tileLayerObjects: { [name: string]: L.TileLayer } = {};

  private markers: { [id: string]: L.Marker } = {};
  marker!: L.Marker;
  hideClusterIcon: boolean = false;
  vehicleGroupLayer: L.MarkerClusterGroup;
  landmarkGroupLayer: L.MarkerClusterGroup;
  curentVehicleId!: number;

  vehicleLayer: L.LayerGroup = new L.LayerGroup();
  routeLayers: FeatureGroup = new FeatureGroup();


  constructor() {
    this.vehicleGroupLayer = this.createClusterGroup();
    this.landmarkGroupLayer = this.createClusterGroup(undefined , 'bi bi-geo-alt-fill')
  }
    ngOnDestroy(): void {
    }
    

  initMap(id: string): void {
    this.map = L.map(id, {

      center: [ 21.0227784, 105.8163641],
      zoom: 15,
      zoomControl: false,
      // contextmenu: true,
      // contextmenuWidth: 140,
      // contextmenuItems: [
      //   {
      //     text: 'Show coordinates',
      //     callback: this.showCoordinates,
      //     context: this
      //   },
      //   {
      //     text: 'Center map here',
      //     callback: this.centerMap,
      //     context: this
      //   },
      // ]
    });

    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    // Thêm control tileLayer
    const tilesGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi-vn', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Vệ tinh Google',
    detectRetina: true,
    maxZoom: 22,
    minZoom: 5,
    });

    const tilesBA1 = L.tileLayer('https://map.binhanh.vn/titservice.ashx?typ=hb&lvl={z}&top={y}&left={x}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Vệ tinh Bình Anh',
    detectRetina: true,
    maxZoom: 18,
    minZoom: 5,
    });


    const tilesBA2 = L.tileLayer('https://map.binhanh.vn/titservice.ashx?typ=ba&lvl={z}&top={y}&left={x}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Bản đồ Bình Anh',
    detectRetina: true,
    maxZoom: 18,
    minZoom: 5,
    });

    this.baseMaps = {
      "Vệ tinh Google": tilesGoogle,
      "Vệ tinh Bình Anh": tilesBA1,
      "Bản đồ Bình Anh": tilesBA2
    };

    tilesGoogle.addTo(this.map);
    L.control.layers(this.baseMaps).addTo(this.map);

    this.vehicleLayer?.addTo(this.map);
    this.vehicleGroupLayer?.addTo(this.map);
    this.routeLayers.addTo(this.map);
    this.landmarkGroupLayer.addTo(this.map);

    this.map.on('contextmenu', (e) => {
      this.showContextMenu(e.latlng); // Hiển thị menu chọn tại vị trí chuột
    });

  }

  private showContextMenu(latlng: any): void {
    this.map.closePopup();
    const options = [
      {
        label: 'Tạo điểm',
        url: '/assets/images/common/black/location-2.png',
        action: () => this.openCreatePointModal(latlng)
      },
      {
        label: 'Đo khoảng cách',
        url: 'assets/images/common/black/meansure.png',
        action: () => this.measureDistance(latlng)
      }
    ];
    const div = L.DomUtil.create('div', 'custom-context-menu');
      div.innerHTML = options.map(option => `<div class="context-menu-item">
        <img class="menu-icon" src=" ${option.url}">
        <label class="menu-label">${option.label}</label>
        </div>`).join('');

    L.popup()
      .setLatLng(latlng)
      .setContent(div)
      .openOn(this.map);

      document.querySelectorAll('.menu-label').forEach((item, index) => {
        item.addEventListener('click', () => {
          options[index]?.action();
          if(index >= 2) options[index - 2].action();
          this.map.closePopup();
        });
      });
  }

  openCreatePointModal(latlng: any) {
  }

  measureDistance(latlng: any) {
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

  public addMarker(id: string, lat: number, lng: number, options: L.MarkerOptions, isCurrent?: boolean, vehicle?: Vehicle): void {
    if (options.iconOptions) {
      options.icon = this.createIcon(options.iconOptions);
    }
    const marker = L.marker([lat, lng], options);

    marker.bindPopup(`<b> Phương tiện : ${vehicle?.privateCode}</b><br>
                      <b> Thời gian : ${moment(vehicle?.date).format('HH:mm DD/MM/yyyy')}</b><br>
                      <b> Km trong ngày : 99km</b><br>
                      <b> Vận tốc : ${vehicle?.velocity} km/h</b><br>
                      <b> Lái xe : ${vehicle?.userName}</b><br>
                      <b> Trạng thái : ${vehicle?.status == 1 ? 'Đang chạy' : 'đang đỗ'}</b><br>
                    `, {autoClose: false, keepInView: true, className: 'custom-popup', autoPan: true} );

    this.markers[id] = marker; // Store marker reference with ID
    if(isCurrent) this.vehicleLayer.addLayer(marker)
    else this.vehicleGroupLayer.addLayer(marker);
  }

  public getMarkerById(id: string): L.Marker {
    return this.markers[id]; // Retrieve marker by ID
  }

  createClusterGroup(options?: L.MarkerClusterGroupOptions, icon?: string): L.MarkerClusterGroup {
    // Đặt các giá trị mặc định
    options = options ?? {};
    options.hideClusterIcon = options.hideClusterIcon ?? false;
    options.chunkedLoading = options.chunkedLoading ?? true;

    if (!options.hideClusterIcon) {
      options.iconHtml = options.iconHtml ?? `<i class=\"${icon ? icon : 'bi bi-car-front-fill'}\"></i>`;
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
  const currentLatRad = currentLatLng.lat * Math.PI / 180;
  const currentLngRad = currentLatLng.lng * Math.PI / 180;

  const earthRadius = 6371;

  const randomDirection = Math.random() * 2 * Math.PI;

  const newLatRad = Math.asin(Math.sin(currentLatRad) * Math.cos(distance / earthRadius) +
                  Math.cos(currentLatRad) * Math.sin(distance / earthRadius) * Math.cos(randomDirection));
  const newLngRad = currentLngRad + Math.atan2(Math.sin(randomDirection) * Math.sin(distance / earthRadius) * Math.cos(currentLatRad),
                  Math.cos(distance / earthRadius) - Math.sin(currentLatRad) * Math.sin(newLatRad));

  const newLat = newLatRad * 180 / Math.PI;
  const newLng = newLngRad * 180 / Math.PI;

  return L.latLng(newLat, newLng);
}

    /**
     * Tạo icon cho marker với các thuộc tính nâng cao
     * @param options Thuộc tính icon
     */
  createIcon(options: L.DivIconOptions) {
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

  private _prevPoint: L.LatLng | null = null;
  slideTo(options: { lat: number; lng: number; keepAtCenter: boolean; duration: number }, vMarker: L.Marker) {
    if (!this.map) { return; }

    const intermediatePoints = this._getIntermediatePoints(options.lat, options.lng, vMarker);

    intermediatePoints.forEach((point, index) => {
      const duration = options.duration / intermediatePoints.length;
      const keepAtCenter = index === intermediatePoints.length - 1 ? options.keepAtCenter : false;

      setTimeout(() => {
        this._moveMarkerTo(point, duration, keepAtCenter, vMarker);
      }, index * duration);
    });
  }

  private _getIntermediatePoints(lat: number, lng: number, vMarker: L.Marker): L.LatLng[] {
    const startPoint = vMarker.getLatLng();
    const endPoint = new L.LatLng(lat, lng);
    const numberOfPoints = 15;

    const intermediatePoints = [];
    for (let i = 1; i < numberOfPoints; i++) {
      const ratio = i / numberOfPoints;
      const intermediateLat = startPoint.lat + (endPoint.lat - startPoint.lat) * ratio;
      const intermediateLng = startPoint.lng + (endPoint.lng - startPoint.lng) * ratio;
      intermediatePoints.push(new L.LatLng(intermediateLat, intermediateLng));
    }
    return intermediatePoints;
  }

  private _moveMarkerTo(point: L.LatLng, duration: number, keepAtCenter: boolean, vMarker: L.Marker) {
    if (!this.map) { return; }

    const startPoint = vMarker.getLatLng();
    const endLatLng = point;
    const start = performance.now();

    const animateMarker = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const currLatLng = new L.LatLng(
        startPoint.lat + (endLatLng.lat - startPoint.lat) * progress,
        startPoint.lng + (endLatLng.lng - startPoint.lng) * progress
      );

      vMarker.setLatLng(currLatLng);

      if (keepAtCenter) {
        this.map.panTo(currLatLng, { animate: false });
      }

      if (progress < 1) {
        L.Util.requestAnimFrame(animateMarker);
      } else {
        this._prevPoint = endLatLng;
      }
    };

    L.Util.requestAnimFrame(animateMarker);
  }

  addMarkerRoute(id: string, lat: number, lng: number, options: L.MarkerOptions,){
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
    return marker
  }

      /**
     * Tạo Circle
     * @param lat Vĩ độ
     * @param lng Kinh độ
     * @param options Các thuộc tính
     */
      createCircle(lat: number, lng: number, options: L.CircleOptions) {
        let circle: L.Circle;
            circle = new L.Circle(new L.LatLng(lat, lng), options);

        return circle;
    }

    createPolygon(latlngs: L.LatLngLiteral[], options: L.PolylineOptions) {
      let polygon: L.Polygon;

      polygon = new L.Polygon(latlngs, options);

      return polygon;
    }

    createPolyline(latlngs: L.LatLngLiteral[], options: L.PolylineOptions) {
      let polyline: L.Polyline;

          polyline = new L.Polyline(latlngs, options);

      return polyline;
    }

    createMarker(lat: number, lng: number, options: L.MarkerOptions, landmark: Landmark) {
      let marker: L.Marker;

      // Kiểm tra tọa độ hợp lệ
          // Bring to front khi hover chuột
          options.riseOnHover = options.riseOnHover ?? true;
          options.interactive = options.interactive ?? true;
          // Tạo icon theo options nếu có
          if (options.iconOptions) {
              options.icon = this.createIcon(options.iconOptions);
          }

          marker = new L.Marker(new L.LatLng(lat, lng), options);
          if (options.popupContent) {
              // options.popupClass = options.popupClass ?? MapDefaultValues.popupClass;
              options.popupMinWidth = options.popupMinWidth ?? 50;
              options.popupMaxWidth = options.popupMaxWidth ?? 500;
              // options.popupOffset = options.popupOffset ?? null;
              marker.bindPopup(options.popupContent, { className: options.popupClass, minWidth: options.popupMinWidth, maxWidth: options.popupMaxWidth, offset: options.popupOffset });
          }

          this.markers[landmark.id] = marker

      return marker;
  }


  /** Tạo component động */
  createComponent<T>(component: Type<T>, viewContainerRef: ViewContainerRef) {
    viewContainerRef?.clear();
    return viewContainerRef?.createComponent(component);
  }
}

