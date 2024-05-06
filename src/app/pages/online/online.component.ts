import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletService } from 'src/app/_services/leaflet.service';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss']
})
export class OnlineComponent extends LeafletService implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {
    // Xóa MAP cũ nếu có
    this.map?.remove();
    this.initMap();
  }

}
