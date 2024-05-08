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
    {id: 546882, privateCode: '24B00608_C', lat: 20.973986, lng: 105.84675, velocity: 72, userName: 'Hoàng Hải Đăng', date: new Date, icon:''},
    {id: 272331, privateCode: '24B00609', lat: 10.819613, lng: 1106.69446, velocity: 24, userName: 'Giang Trung Hiền', date: new Date, icon:''},
    {id: 546876, privateCode: '24B00609_C', lat: 20.973986, lng: 105.84675, velocity: 10, userName: 'LAI XE DANG XUAT', date: new Date, icon:''},
  ];
  constructor() {
    super();
  }

  ngAfterViewInit() {
    // Xóa MAP cũ nếu có
    this.map?.remove();
    this.initMap('map2');
  }


}
