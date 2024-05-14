import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as moment from 'moment';
import { RouteModel } from 'src/app/_models/route';
import { Vehicle } from 'src/app/_models/vehicle';
import { LeafletService } from 'src/app/_services/leaflet.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent extends LeafletService implements AfterViewInit {
  listVehicle: Vehicle[] = [
    {id: 10001, privateCode: '14C16317', lat: 10.767598, lng: 106.689415, velocity: 40, userName: 'Hoàng Văn Long', date: new Date, icon:'', groupId: 1, status:1},
    {id: 10002, privateCode: '19C06580', lat: 10.858499, lng: 106.65221, velocity: 16, userName: 'Nguyễn Nhật Nam', date: new Date, icon:'', groupId: 2 , status:1},
    {id: 10003, privateCode: '24B00606', lat: 10.767991, lng: 106.68936, velocity: 2, userName: 'Nguyễn Văn Thuận', date: new Date, icon:'', groupId: 3, status:1},
    {id: 10004, privateCode: '24B00606_C', lat: 20.973986, lng: 105.84675, velocity: 54, userName: 'Nguyễn Văn Dũng', date: new Date, icon:'', groupId: 3, status:1},
    {id: 10005, privateCode: '24B00608_C', lat: 20.823234, lng: 105.94652, velocity: 72, userName: 'Hoàng Hải Đăng', date: new Date, icon:'', groupId: 4, status:1},
    {id: 10006, privateCode: '24B00609', lat: 10.819613, lng: 106.69446, velocity: 24, userName: 'Giang Trung Hiền', date: new Date, icon:'', groupId: 4, status:1},
    {id: 10007, privateCode: '24B00609_C', lat: 20.813119, lng: 105.74653, velocity: 10, userName: 'LAI XE DANG XUAT', date: new Date, icon:'', groupId: 4, status:1},
  ];

  dataRoute: RouteModel[] = [];
  latestPoint!: L.LatLng;
  listPolylines: { color: string, polyline: L.Polyline }[] = [];
  currentKm: number = 0;
  arrowKmStep: number = 1;
  selectedVehicle: Vehicle | undefined;
  currentDate: Date = new Date();
  vehicleMarker!: L.Marker;
  private routeMarkers: L.Marker[]= [];
  totalKm: number = 0;
  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    // Xóa MAP cũ nếu có
    this.map?.remove();
    this.initMap('map');
  }

  onChangeSelectedVehicle(value: any){

    this.routeLayers.clearLayers();
    this.dataRoute = [];
    this.listPolylines = [];
    this.currentKm = 0;
  
    if(value){
      this.selectedVehicle = this.listVehicle.find(e => e.id == value?.id);
      if(this.selectedVehicle)
      for (let i = 1; i < 200; i++) {
        const oldLatlng = this.dataRoute?.length > 0 ? new L.LatLng(this.dataRoute[this.dataRoute?.length -1].lat, this.dataRoute[this.dataRoute?.length -1].lng) 
        : new L.LatLng(this.selectedVehicle.lat, this.selectedVehicle.lng);
        const newLatlng = this.generateRandomLatLng(new L.LatLng(oldLatlng.lat, oldLatlng.lng), 0.1);
        const route = new RouteModel();
        route.id = i;
        route.kmGps = i * 0.5;
        this.currentDate.setHours(0, 0, i * 10, 0);
        route.dateTime = moment(this.currentDate).format('DD/MM HH:mm');
        route.privateCode = this.selectedVehicle?.privateCode;
        route.velocity = Math.floor( Math.random() * (80 - 1) + 1) + 1;
        route.userName = this.selectedVehicle?.userName;
        route.lat = newLatlng.lat;
        route.lng = newLatlng.lng;
        this.dataRoute.push(route);
      } 
      this.dataRoute.forEach((e, index) => {
        this.initRouter(index);
        this.routerVehicle(e);
      })

      if(this.dataRoute?.length > 0) this.totalKm = this.dataRoute[this.dataRoute?.length -1].kmGps - this.dataRoute[0].kmGps;
    }
  }

  initRouter(index: number) {
    // Tạo điểm đầu và điểm cuối
    const route = this.dataRoute[index];

    const endIndex = this.dataRoute.length - 1;
    if (index === 0) {
      // Tạo marker điểm đầu
      const marker = this.addMarkerRoute(route?.id.toString(),route.lat, route.lng, {
        iconOptions: {
          iconUrl: '/assets/images/common/point-green.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          className: 'marker-icon-vehicle-selected',
          labelContent: 'Điểm xuất phát'
        }
      });
      this.routeMarkers.push(marker);
      this.routeLayers.addLayer(marker);

      // Tạo icon xe
      this.latestPoint = new L.LatLng(route.lat, route.lng);
      this.vehicleMarker?.remove();
      this.vehicleMarker = new L.Marker( new L.LatLng(route.lat, route.lng));
      this.vehicleMarker.setIcon(this.createIcon({
          iconSize: [25, 25],
          iconAnchor: [15, 15],
          iconUrl: '/assets/images/vehicle/car/Blue0.png',
          className: 'marker-icon-vehicle-selected',
          labelContent: this.selectedVehicle?.privateCode,
          rotationDeg: 90,
        })
      )

      if (this.vehicleMarker) {
        this.routeMarkers.push(this.vehicleMarker);
        this.routeLayers.addLayer(this.vehicleMarker);
        this.map.setView(this.vehicleMarker?.getLatLng());
      }
    }
    else if (index === endIndex && endIndex > 0) {
      // Tạo marker điểm cuối
      let lat = this.vehicleMarker.getLatLng().lat;
      let lng = this.vehicleMarker.getLatLng().lng;
      if (route.lat > 0) {
        lat = route.lat;
      }
      if (route.lng > 0) {
        lng = route.lng;
      }
      // this.vehicleMarker.setLatLng([lat, lng]);

      const marker = this.addMarkerRoute(route?.id.toString(),lat, lng, {
        iconOptions: {
          iconUrl: '/assets/images/common/point-red.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          className: 'marker-icon-vehicle-selected',
          labelContent: 'Điểm kết thúc',
        }
      });
      this.routeMarkers.push(marker);
      this.routeLayers.addLayer(marker)
    }
  }

  routerVehicle(route: RouteModel, color?: string, speed?: number, isPlay?: boolean) {
    if (!color) color = '#0000ED';
      // Vẽ line lộ trình
      this.addLineMultiColor(route, color);
      // Vẽ icon mũi tên
      this.addArrowMarker(route, color);

      if (route.lat !== 0 && route.lng !== 0) {
        const latlngCurrent = new L.LatLng(route.lat, route.lng);

        this.latestPoint = latlngCurrent;
        const angleDeg = this.computeDirection(this.vehicleMarker.getLatLng().lat, this.vehicleMarker.getLatLng().lng, route?.lat, route?.lng);
        this.updateIconMarker(this.vehicleMarker, this.selectedVehicle ?? new Vehicle(), angleDeg, true);
        // if(isPlay)this.slideTo({ lat: latlngCurrent.lat, lng: latlngCurrent.lng, duration: speed ?? route.velocity * 1000, keepAtCenter: true }, this.vehicleMarker);

        if (!this.map.getBounds().contains(latlngCurrent)) {
          this.map.setView(latlngCurrent);
        }
      }

  }

  addLineMultiColor(route: RouteModel, color: string) {
    let createNewLine = false;
    let lineItem = this.listPolylines[this.listPolylines.length - 1];
    const latLng = (route.lat && route.lng) ? new L.LatLng(route.lat, route.lng) : this.latestPoint;

    if (lineItem) {
      if (lineItem.color !== color) {
        createNewLine = true;
      }

      lineItem.polyline.addLatLng(latLng);
    }
    else {
      createNewLine = true;
    }

    // Vẽ nhiều màu
    if (createNewLine) {
      lineItem = {
        color: color,
        polyline: new L.Polyline([latLng], { color: color, weight: 2 })
      };
      this.listPolylines.push(lineItem);
      lineItem.polyline?.addTo(this.routeLayers);
    }
  }

  addArrowMarker(route: RouteModel, color: string) {
    // Tính hướng
    const eDirection = this.computeDirection(this.latestPoint.lat, this.latestPoint.lng, route.lat, route.lng);
    // Vẽ icon mũi tên theo cấu hình
    if (this.arrowKmStep > 0 && route.kmGps - this.currentKm > this.arrowKmStep) {
      this.currentKm = route.kmGps;

      const arrow = this.addMarkerRoute(route.id?.toString(),route.lat, route.lng, {
        iconOptions: {
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          fontAwesomeClass: 'bi bi-caret-up-fill',
          fontAwesomeColor: color,
          className:  'marker-icon-vehicle-selected',
          rotationDeg: eDirection,
        }
      });

      if (arrow != undefined && arrow != null) {
        if (route.lat === 0 && route.lng === 0) {
          if (this.vehicleMarker) {
            arrow.setLatLng(this.vehicleMarker.getLatLng());
          }
        }

        this.routeMarkers.push(arrow);
        this.routeLayers.addLayer(arrow);
      }
    }
  }

  onChangeSeletedRoute(value: any){
    this.routeLayers.clearLayers();
    this.listPolylines = [];
    this.currentKm = 0;
    this.dataRoute.forEach((e, index) => {
      this.initRouter(index);
      if(e.id <=value.id) this.routerVehicle(e);
      if(e.id == value.id){
        this.vehicleMarker.setLatLng([e.lat, e.lng]);
      } 
    })
  }

  playRoute(data: any){
    this.routeLayers.clearLayers();
    this.listPolylines = [];
    this.currentKm = 0;
    this.dataRoute.forEach((e, index) => {
      this.initRouter(index);
      if(index <= data.index) this.routerVehicle(e);
      if(e.id == data.index){
        this.vehicleMarker.setLatLng([e.lat, e.lng]);
      } 
    })
  }
}
