import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LandmarkCategory } from 'src/app/_models/landmark/landmark-category';
import { LandmarkGroup } from 'src/app/_models/landmark/landmark-group';
import { Landmark } from 'src/app/_models/landmark/landmark.model';
import { LeafletService, extendLeaflet } from 'src/app/_services/leaflet.service';
import { AddOrEditLandmarkComponent } from './add-or-edit-landmark/add-or-edit-landmark.component';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-landmark',
  templateUrl: './landmark.component.html',
  styleUrls: ['./landmark.component.scss']
})
export class LandmarkComponent extends LeafletService implements AfterViewInit {

  listLandmark: Landmark[] = [
    {
      id: 74890,
      name: 'Trạm Thu Phí Quốc lộ 51 - T3',
      privateName: 'T2 QL51 - BR-Vũng Tàu',
      address: 'Km 70 + 0 QL51',
      description: '',
      icon: 'assets/images/utility/landmark-management/point/baido.png',
      latitude: 10.501076,
      longitude: 107.096612,
      polygon: '107.095789,10.501658,107.095810,10.501035,107.097596,10.500461,107.097253,10.501199',
      polyline: '',
      color: 255,
      radius: 200,
      groupIDs: [1],
      categoryID: 1,
      categoryName: 'Landmark_LandmarkCategory_Charge_Fee',
      companyID: 0,
      languageID: 0,
      systemID: 0,
      isVisible: true,
      isLandmarkManagement: true,
      isManagementByCircle: false,
      isSystemLandmark: false,
      isClosed: true,
      isTranslate: false,
      isDisplayName: false,
      isDisplayBound: false,
      highwayVelocityAllow: 0
    },
    {
      id: 74978,
      name: 'Tram thu phí Thăng Long',
      privateName: '',
      address: 'Km10 + 0 cao tốc TL-Nội Bài',
      description: '',
      icon: 'assets/images/utility/landmark-management/point/91.png',
      latitude: 21.200601,
      longitude: 105.780126,
      polygon: '105.779932,21.196686,105.779323,21.201181,105.779214,21.202151,105.778983,21.204034,105.779881,21.204112,105.780384,21.204173,105.780568,21.203412,105.780665,21.202804,105.780775,21.202318,105.780798,21.201703,105.780865,21.201121,105.781074,21.196886',
      polyline: '',
      color: 255,
      radius: 200,
      groupIDs: [1],
      categoryID: 2,
      categoryName: 'Landmark_LandmarkCategory_Charge_Fee',
      companyID: 0,
      languageID: 0,
      systemID: 0,
      isVisible: true,
      isLandmarkManagement: true,
      isManagementByCircle: false,
      isSystemLandmark: false,
      isClosed: true,
      isTranslate: false,
      isDisplayName: false,
      isDisplayBound: false,
      highwayVelocityAllow: 0
    },
    {
      id: 74968,
      name: 'Trạm thu phí BOT cầu Bến Thủy 1',
      privateName: 'Bến Thủy - Nghệ An',
      address: '1,Bến Thủy,Thành phố Vinh,Nghệ An',
      description: '',
      icon: 'assets/images/utility/landmark-management/point/diem_khac.png',
      latitude: 18.648026,
      longitude: 105.705705,
      polygon: '105.706699,18.647061,105.705868,18.646987,105.705278,18.647506,105.704176,18.648471,105.704597,18.649069,105.705428,18.648959,105.707241,18.647841',
      polyline: '',
      color: 255,
      radius: 200,
      groupIDs: [2],
      categoryID: 3,
      categoryName: 'Landmark_LandmarkCategory_Charge_Fee',
      companyID: 0,
      languageID: 0,
      systemID: 0,
      isVisible: true,
      isLandmarkManagement: true,
      isManagementByCircle: false,
      isSystemLandmark: false,
      isClosed: true,
      isTranslate: false,
      isDisplayName: false,
      isDisplayBound: false,
      highwayVelocityAllow: 0
    },
    {
      id: 75036,
      name: 'Trạm thu phí Cầu Yên Lệnh',
      privateName: '',
      address: 'P. Hiền Nam,Hưng Yên,Hưng Yên',
      description: '',
      icon: 'assets/images/utility/landmark-management/point/baido.png',
      latitude: 20.658979,
      longitude: 106.048867,
      polygon: '106.047442,20.659299,106.050071,20.659269,106.050103,20.658556,106.047517,20.658797',
      polyline: '',
      color: 255,
      radius: 200,
      groupIDs: [2],
      categoryID: 1,
      categoryName: 'Landmark_LandmarkCategory_Charge_Fee',
      companyID: 1,
      languageID: 0,
      systemID: 0,
      isVisible: true, // displayLandmark
      isLandmarkManagement: true, // controlLandmark
      isManagementByCircle: false,
      isSystemLandmark: false,
      isClosed: true,
      isTranslate: false,
      isDisplayName: false,
      isDisplayBound: false,
      highwayVelocityAllow: 0
    },
    {
      id: 75044,
      name: 'Trạm thu phí Cầu Tiên Cựu',
      privateName: '',
      address: '10,Đại Thắng,Tiên Lãng,Hải Phòng',
      description: '',
      icon: 'assets/images/utility/landmark-management/point/91.png',
      latitude: 20.776557,
      longitude: 106.507996,
      polygon: '106.506550,20.776489,106.507991,20.776850,106.509426,20.777095,106.509487,20.776674,106.508109,20.776293,106.506668,20.775992',
      polyline: '',
      color: 255,
      radius: 200,
      groupIDs: [3],
      categoryID: 2,
      categoryName: 'Landmark_LandmarkCategory_Charge_Fee',
      companyID: 1,
      languageID: 0,
      systemID: 0,
      isVisible: true,
      isLandmarkManagement: true,
      isManagementByCircle: false,
      isSystemLandmark: false,
      isClosed: true,
      isTranslate: false,
      isDisplayName: false,
      isDisplayBound: false,
      highwayVelocityAllow: 0
    },
    {
      id: 75111,
      name: 'Trạm Thu Phí Đại lộ Bình Dương (Suối Giữa)',
      privateName: '',
      address: '848,13,Định Hoà,TX. Thủ Dầu Một,Bình Dương',
      description: '',
      icon: 'assets/images/utility/landmark-management/point/diem_khac.png',
      latitude: 11.005209,
      longitude: 106.645642,
      polygon: '106.645103,11.006226,106.645575,11.006310,106.646175,11.004236,106.645692,11.004098',
      polyline: '',
      color: 255,
      radius: 200,
      groupIDs: [3],
      categoryID: 3,
      categoryName: 'Landmark_LandmarkCategory_Charge_Fee',
      companyID: 1,
      languageID: 0,
      systemID: 0,
      isVisible: true,
      isLandmarkManagement: true,
      isManagementByCircle: false,
      isSystemLandmark: false,
      isClosed: true,
      isTranslate: false,
      isDisplayName: false,
      isDisplayBound: false,
      highwayVelocityAllow: 0
    }
  ];
  listLandmarkCategorys: LandmarkCategory[] = [
    { id: 1, name: 'Bãi đỗ', icon: 'assets/images/utility/landmark-management/point/baido.png', resourceCode: ''},
    { id: 2, name: 'Điểm trạm', icon: 'assets/images/utility/landmark-management/point/91.png', resourceCode: ''},
    { id: 3, name: 'Điểm khác', icon: 'assets/images/utility/landmark-management/point/diem_khac.png', resourceCode: ''},
  ];
  // Nhóm điểm
  listLandmarkGroups: LandmarkGroup[] = [
    { id: 1, name: 'Nhóm điểm 1'},
    { id: 2, name: 'Nhóm điểm 2'},
    { id: 3, name: 'Nhóm điểm 3'},
  ];

  @ViewChild('createOrEditLandmark1', { static: true }) createOrEditEmployee!: AddOrEditLandmarkComponent;
  @ViewChild('leftPanel', { static: true }) leftPanel!: LeftPanelComponent;
  layerLandmark!: L.FeatureGroup;

  constructor() {
    super();
   }

   ngAfterViewInit(): void {
    // Xóa MAP cũ nếu có
    this.map?.remove();
    this.initMap('map3');

    this.listLandmark.forEach(e => {
      const marker = this.createMarker(e.latitude, e.longitude, {
         iconOptions: {
           iconUrl: e.icon,
           labelContent: e.name,
           className: 'custom-marker-icon-landmark'
         },
         draggable: true
       }, e)

       this.landmarkGroupLayer.addLayer(marker)
     });
    // Mở rộng leaflet
    extendLeaflet();
  }

  ngOnInit() {
  }

  onChangeSelectedLandmark(value: any){
    this.createOrEditEmployee.hide();
   const vMarker = this.getMarkerById(value.id);
   if(vMarker){
      this.map.setView(vMarker?.getLatLng());
   }
  }

  add(value: any){
    const marker = this.createMarker(value.latitude, value.longitude, {
      iconOptions: {
        iconUrl: value.icon,
        labelContent: value.name,
        className: 'custom-marker-icon-landmark'
      },
      draggable: true
    }, value)

    this.landmarkGroupLayer.addLayer(marker)
  }

  remove(value: any){
    const vMarker = this.getMarkerById(value.id);
    this.landmarkGroupLayer.removeLayer(vMarker);
  }

  reloadList(listData: any){
    this.listLandmark.forEach(e => {
      const vMarker = this.getMarkerById(e.id.toString());
      this.landmarkGroupLayer.removeLayer(vMarker);
    })
    this.listLandmark = listData;
    this.listLandmark.forEach(e => {
      const marker = this.createMarker(e.latitude, e.longitude, {
         iconOptions: {
           iconUrl: e.icon,
           labelContent: e.name,
           className: 'custom-marker-icon-landmark'
         },
         draggable: true
       }, e)

       this.landmarkGroupLayer.addLayer(marker)
     });
  }

  modalSave(value?: any){
    this.listLandmark.forEach(e => {
      const vMarker = this.getMarkerById(e.id.toString());
      this.landmarkGroupLayer.removeLayer(vMarker);
    })
      value.id = Math.floor(10000 + Math.random() * 90000);
      this.listLandmark = this.listLandmark.concat(value);

      this.listLandmark.forEach(e => {
        const marker = this.createMarker(e.latitude, e.longitude, {
           iconOptions: {
             iconUrl: e.icon,
             labelContent: e.name,
             className: 'custom-marker-icon-landmark'
           },
           draggable: true
         }, e)

         this.landmarkGroupLayer.addLayer(marker)
       });
  }

  override openCreatePointModal(latlng: any){
    this.createOrEditEmployee?.show(undefined, latlng);
    this.leftPanel.createOrEditEmployee.hide();
  }

  onChangeCheckBox(data: any){
    if(data.showLandmarkName){
      this.listLandmark.forEach(e => {
        const vMarker = this.getMarkerById(e.id.toString());
        this.landmarkGroupLayer.removeLayer(vMarker);
      })
      this.listLandmark.forEach(e => {
        const marker = this.createMarker(e.latitude, e.longitude, {
           iconOptions: {
             iconUrl: e.icon,
             labelContent: e.name,
             className: 'custom-marker-icon-landmark'
           },
           draggable: true
         }, e)

         this.landmarkGroupLayer.addLayer(marker)
       });
    } else {
      this.listLandmark.forEach(e => {
        const vMarker = this.getMarkerById(e.id.toString());
        this.landmarkGroupLayer.removeLayer(vMarker);
      })
      this.listLandmark.forEach(e => {
        const marker = this.createMarker(e.latitude, e.longitude, {
           iconOptions: {
             iconUrl: e.icon,
             className: 'custom-marker-icon-landmark'
           },
           draggable: true
         }, e)

         this.landmarkGroupLayer.addLayer(marker)
       });
    }

    if(data.showPolygon){
      this.layerLandmark?.clearLayers();
      this.layerLandmark?.remove();
      this.layerLandmark = new L.FeatureGroup();
      this.map?.addLayer(this.layerLandmark);

      this.listLandmark.forEach(e => {
        if (e.isManagementByCircle) {
          const tempSurround = this.createCircle(
            e.latitude,
            e.longitude,
            {
              radius: e.radius, fill: true, fillColor:  '#2F80ED', fillOpacity: 0.5, color: '#2F80ED', weight: 1.5
            }
          );
          this.layerLandmark.addLayer(tempSurround);
        }
        else {
          if (e.isClosed) {
            if (e.polygon) {
              const arrTemp = e.polygon.split(',');
              const listPoint: any[] = [];
              for (let index = 0; index < arrTemp.length; index++) {
                listPoint.push({
                  lng: Number.parseFloat(arrTemp[index]),
                  lat: Number.parseFloat(arrTemp[index + 1]),
                });
                index++;
              }
              const tempSurround = this.createPolygon(
                listPoint,
                {
                  fill: true, fillColor: '#2F80ED', fillOpacity:0.5, color: '#2F80ED', weight: 1.5
                }
              );
              this.layerLandmark.addLayer(tempSurround);
            }
          }
          else {
            if (e.polyline && e.polyline) {
              // Vẽ Line
              const arrTemp = e.polyline.split(',');
              const listPoint: L.LatLngLiteral[] = [];
              for (let index = 0; index < arrTemp.length; index++) {
                listPoint.push({
                  lng: Number.parseFloat(arrTemp[index]),
                  lat: Number.parseFloat(arrTemp[index + 1]),
                });
                index++;
              }
              const tempSurround = this.createPolyline(
                listPoint,
                { color: '#2F80ED', weight: 1.5 }
              );

              this.layerLandmark.addLayer(tempSurround);

                const arrTemp2 = e.polygon.split(',');
                const listPoint2: any[] = [];
                for (let index = 0; index < arrTemp2.length; index++) {
                  listPoint2.push({
                    lng: Number.parseFloat(arrTemp2[index]),
                    lat: Number.parseFloat(arrTemp2[index + 1]),
                  });
                  index++;
                }
                const tempSurround2 = this.createPolygon(
                  listPoint2,
                  {
                    fill: true, fillColor: '#2F80ED', fillOpacity:0.5, color: '#2F80ED', weight: 1.5
                  }
                );
                this.layerLandmark.addLayer(tempSurround2);
            }
          }
        }
      })
    } else {
      this.layerLandmark?.clearLayers();
      this.layerLandmark?.remove();
    }
  }
}
