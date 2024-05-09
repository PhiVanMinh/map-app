import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Vehicle } from 'src/app/_models/vehicle';
import { LeafletService } from 'src/app/_services/leaflet.service';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent extends LeafletService  implements AfterViewInit {
  listVehicle: Vehicle[] = [
    {id: 441039, privateCode: '14C16317', lat: 10.767598, lng: 106.689415, velocity: 40, userName: 'Hoàng Văn Long', date: new Date, icon:''},
    {id: 440894, privateCode: '19C06580', lat: 10.858499, lng: 106.65221, velocity: 16, userName: 'Nguyễn Nhật Nam', date: new Date, icon:''},
    {id: 272332, privateCode: '24B00606', lat: 10.767991, lng: 106.68936, velocity: 2, userName: 'Nguyễn Văn Thuận', date: new Date, icon:''},
    {id: 546890, privateCode: '24B00606_C', lat: 20.973986, lng: 105.84675, velocity: 54, userName: 'Nguyễn Văn Dũng', date: new Date, icon:''},
    {id: 546882, privateCode: '24B00608_C', lat: 20.823234, lng: 105.94652, velocity: 72, userName: 'Hoàng Hải Đăng', date: new Date, icon:''},
    {id: 272331, privateCode: '24B00609', lat: 10.819613, lng: 1106.69446, velocity: 24, userName: 'Giang Trung Hiền', date: new Date, icon:''},
    {id: 546876, privateCode: '24B00609_C', lat: 20.813119, lng: 105.74653, velocity: 10, userName: 'LAI XE DANG XUAT', date: new Date, icon:''},
  ];

  interval: any;
  selectedVehicle!: Vehicle;
  constructor() {
    super();
  }

  override ngOnDestroy(): void {
    // Hủy bỏ interval khi component bị hủy
    clearInterval(this.interval);
  }

  ngAfterViewInit() {
    // Xóa MAP cũ nếu có
    this.map?.remove();
    this.initMap('map2');
    this.bindingData();

    // Khởi tạo interval khi component được khởi tạo
    this.interval = setInterval(() => {
      this.getDataOnline();
    }, 10000); // Chạy hàm mỗi 10 giây
  }

  bindingData(){
    this.listVehicle.forEach(e => {
      this.addMarker(e.id.toString(), e.lat, e.lng, {
        iconOptions: {
          iconSize: [25, 25],
          iconAnchor: [15, 15],
          iconUrl: '/assets/images/vehicle/car/Blue0.png',
          className: 'marker-icon-vehicle',
          labelContent: e.privateCode,
          rotationDeg: 0,
          },
      });
    })

  }

  getDataOnline() { //generateRandomLatLng
    this.listVehicle.map(e => {
      const marker = this.getMarkerById(e?.id?.toString())
      if(marker){
        const newMarker = this.generateRandomLatLng(marker.getLatLng(), 0.5);
        const angleDeg = this.computeDirection(marker.getLatLng().lat, marker.getLatLng().lng, newMarker?.lat, newMarker?.lng);
        this.updateIconMarker(marker, e, angleDeg, e.id == this.selectedVehicle?.id);
        marker.setLatLng(newMarker);
      } else {
        this.addMarker(e.id.toString(), e.lat, e.lng, {
          iconOptions: {
            iconSize: [25, 25],
            iconAnchor: [15, 15],
            iconUrl: '/assets/images/vehicle/car/Blue0.png',
            className: 'marker-icon-vehicle',
            labelContent: e.privateCode,
            rotationDeg: 0,
            },
        }, true);
      }
      if(e.id == this.selectedVehicle?.id) this.map.setView(marker?.getLatLng());
    })
  }

onChangeSelectedVehicle(value: Vehicle){
  this.selectedVehicle = value;
  const vMarker = this.getMarkerById(value?.id?.toString());
  if(vMarker){
    this.listVehicle.map(e => {
      const marker = this.getMarkerById(e?.id?.toString())
      this.updateIconMarker(marker, e, 0, e.id == value?.id);
    })

    this.map.setView(vMarker?.getLatLng());
  } else {
    this.addMarker(value.id.toString(), value.lat, value.lng, {
      iconOptions: {
        iconSize: [25, 25],
        iconAnchor: [15, 15],
        iconUrl: '/assets/images/vehicle/car/Blue0.png',
        className: 'marker-icon-vehicle',
        labelContent: value.privateCode,
        rotationDeg: 0,
        },
    }, true);
  }

}
}
