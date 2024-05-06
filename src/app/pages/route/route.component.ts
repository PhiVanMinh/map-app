import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletService } from 'src/app/_services/leaflet.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent extends LeafletService implements AfterViewInit {

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    // Xóa MAP cũ nếu có
    this.map?.remove();
    this.initMap('map');
  }
}
