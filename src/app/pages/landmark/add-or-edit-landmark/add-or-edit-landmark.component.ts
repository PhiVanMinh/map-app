import { Component, EventEmitter, OnInit, Output, ViewChild, HostListener, ElementRef, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as L from 'leaflet';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/_models/employee';
import { LandmarkCategory } from 'src/app/_models/landmark/landmark-category';
import { LandmarkGroup } from 'src/app/_models/landmark/landmark-group';
import { Landmark } from 'src/app/_models/landmark/landmark.model';
import { User } from 'src/app/_models/user-infomation';
import { LeafletService } from 'src/app/_services/leaflet.service';
import * as turf from '@turf/turf';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-or-edit-landmark',
  templateUrl: './add-or-edit-landmark.component.html',
  styleUrls: ['./add-or-edit-landmark.component.scss']
})
export class AddOrEditLandmarkComponent implements OnInit, OnDestroy {

  @ViewChild('modal') public modal!: ModalDirective;
  @Output() modalSave = new EventEmitter<Landmark>();
  // @ViewChild('f') courseForm!: NgForm;

  form: User = new User();
  employee: Employee = new Employee();
  confirmPass!: string;
  password!: string;
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Chọn tất cả',
    unSelectAllText: 'Bỏ chọn tất cả',
    itemsShowLimit: 20,
    allowSearchFilter: true
  };

  dragging = false;
  left = 0;
  top = 0;
  lastX = 0;
  lastY = 0;

  isShow = false;
  isCreate = true;

  nameLandmark = '';
  privateName = '';
  description = '';
  latLng = '';
  pointLatLng!: L.LatLng;
  colorLandmark = '#2F80ED';
  controlLandmark = true;
  displayLandmark = true;
  drawStyle = 1;
  radiusLandmark = 100;
  speedAllows!: number;
  address: string = 'Đây là địa chỉ';
  listLandmarks: Landmark[] = [];
  @Input() listLandmarkGroups: LandmarkGroup[] = [];
  // landmarkGroupFields = LANDMARK_GROUP_FIELDS;
  selectedLandmarkGroupIDs: number[] = [];
  numberRowEnableVirtualScroll = 50;
  @Input() currentMap!: L.Map;
  initEventDraw = false;
  createLayerBusy = false;
  createLayer = true;
  editLayer = false;
  editDrawHandler: any;
  turfLayer!: L.GeoJSON;
  layerDrawLandmark!: L.FeatureGroup;
  polygonDrawer!: L.Draw.Polygon;
  circleDrawer!: L.Draw.Circle;
  polylineDrawer!: L.Draw.Polyline;
  // subscriptions = new Subscription();

  tempMarker!: L.Marker | any; // Dùng cho Form thêm, sửa MapMarker
  tempSurround: any;
  listDrawStyle: { id: number; text: string }[] = [
    { id: 1, text: 'Hình tròn' },
    { id: 2, text: 'Đường' },
    { id: 3, text: 'Đa giác' },
  ];
  editLandmark!: Landmark;
  landmarkid = 0;
  showSpeedInput!: boolean;

  // dicCategory = new Dictionary<number, LandmarkCategory>();
  selectedCategoryId!: number;
  // categoryFields = LANDMARK_CATEGORY_FIELDS;


  // @ViewChild('form') formRef!: NgForm;

  mapObject: any;
  @Input() listLandmarkCategorys: LandmarkCategory[] = [];
  selectedLandmarkCategoryIds: any;

  constructor(
    private leafletSv: LeafletService,
    private toastr: ToastrService,
    private el: ElementRef
  ) { }

  hide() {
    this.refresh();
    this.modal.hide();
  }

  startDrag(event: MouseEvent) {
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.dragging = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging) {
      const deltaX = event.clientX - this.lastX;
      const deltaY = event.clientY - this.lastY;
      this.left += deltaX;
      this.top += deltaY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
  }

  dragMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.startDrag(event);
  }

  onSubmit() {
    this.employee.empName = this.form.fullName;
    this.employee.userName = this.form.userName;
    this.employee.email = this.form.email;
    if (!this.employee.userId) this.employee.password = this.form.password;
    this.employee.birthDay = this.form.birthDay;
    this.employee.gender = this.form.gender;
    this.employee.phoneNumber = this.form.phoneNumber;
    this.employee.role = Number(this.form.role);
  }


  ngOnDestroy(): void {
    // Gỡ bỏ temp marker và đường bao
    this.tempMarker?.remove();
    this.tempMarker = null;
    this.tempSurround?.remove();
    this.tempSurround = null;
    // Gỡ bỏ group vẽ
    this.layerDrawLandmark?.clearLayers();
    this.layerDrawLandmark?.remove();
    this.turfLayer?.clearLayers();
    this.turfLayer?.remove();
    // Gỡ bỏ các event listened
    this.currentMap?.off('draw:created');
    this.currentMap?.off('draw:deleted');
    // Gỡ bỏ các đường vẽ
    this.cancelDraw();
    this.clearDraw();
    this.removeBorderPolyline();
    // this.subscriptions.unsubscribe();
  }

  refresh() {
    // Gỡ bỏ temp marker và đường bao
    // this.tempMarker?.remove();
    // this.tempMarker = null;
    // this.tempSurround?.remove();
    // this.tempSurround = null;
    // // Gỡ bỏ group vẽ
    // this.layerDrawLandmark?.clearLayers();
    // this.layerDrawLandmark?.remove();
    // this.turfLayer?.clearLayers();
    // this.turfLayer?.remove();
    // // Gỡ bỏ các event listened
    // this.currentMap?.off('draw:created');
    // this.currentMap?.off('draw:deleted');
    // // Gỡ bỏ các đường vẽ
    // this.cancelDraw();
    // this.clearDraw();
    // this.removeBorderPolyline();

    this.layerDrawLandmark?.clearLayers();
    this.layerDrawLandmark?.remove();
    this.initEventDraw = false;

  }

  ngOnInit() {
    // this.getLandmarkData();
  }

  show(value?: Landmark, latlng?: L.LatLng) {
    this.refresh();
    if (value) {
      this.isCreate = false;
      this.editLandmark = value;
      if (value.isManagementByCircle) {
        this.drawStyle = 1;
        this.radiusLandmark = value.radius;
      }
      this.selectedLandmarkCategoryIds = value.categoryID;
      this.selectedLandmarkGroupIDs = value.groupIDs;
      this.nameLandmark = value.name;
      this.privateName = value.privateName;
      this.latLng = `${value.latitude}, ${value.longitude}`;
      this.address = value.address;
      this.colorLandmark = '#' + value.color.toString(16);
    } else {
      this.isCreate = true;
      this.editLandmark = new Landmark();
      this.drawStyle = 1;
      this.radiusLandmark = 100;
      this.selectedLandmarkCategoryIds = 1;
      this.selectedLandmarkGroupIDs = [];
      this.nameLandmark = '';
      this.privateName = '';
      this.latLng = '';
      this.address = 'Đây là địa chỉ';
      this.colorLandmark = '#2F80ED';
    }

    if (latlng) this.latLng = `${latlng.lat}, ${latlng.lng}`;

    const config: ModalOptions = {
      backdrop: 'static',
      keyboard: false
    };

    this.modal.config = config;
    this.modal.show();

    const mapObject = {
      zoom: this.currentMap.getZoom(),
      center: latlng,
      eType: this.isCreate ? 'contextmenu' : 'update-landmark',
    }
    this.initDraw(mapObject);

    // this.obsSv.isFormLandmarkInputShowing.next(true);
  }

  initDraw(mapObject?: any) {
    const that = this;
    if (!this.initEventDraw) {
      // Tạo Drawlayer
      this.layerDrawLandmark = new L.FeatureGroup();
      this.currentMap?.addLayer(this.layerDrawLandmark);
      this.eventDrawMap();
      this.turfLayer = L.geoJSON(null, {
        style() {
          const style = {
            color: that.colorLandmark,
            fillColor: that.colorLandmark,
            weight: 1.5
          };
          return style;
        },
      });
      this.turfLayer.addTo(this.currentMap);
      this.initEventDraw = true;
    }
    // Loại sự kiện (thêm mới, update)
    if (mapObject?.eType && mapObject?.eType === 'contextmenu') {
      const lat = this.roundToDecimal(mapObject?.center.lat);
      const lng = this.roundToDecimal(mapObject?.center.lng);
      this.latLng = `${lat}, ${lng}`;
      this.address = '';
      this.pointLatLng = new L.LatLng(lat, lng);
      this.getAddress();
      this.currentMap?.panTo(this.pointLatLng);

      this.tempMarker = this.createTempMarker(this.pointLatLng, 'Tạo điểm');
      this.currentMap?.addLayer(this.tempMarker);
      this.tempMarker.on('dragend', function () {
        const pos = new L.LatLng(0, 0) //this.getLatLng(); // lấy thông tin điểm hiện tại
        const newLat = that.roundToDecimal(pos.lat);
        const newLng = that.roundToDecimal(pos.lng);
        that.latLng = `${newLat}, ${newLng}`;
        that.pointLatLng = new L.LatLng(newLat, newLng);
        that.getAddress();

        that.editLayer = false;
        that.createLayer = false;

        that.layerDrawLandmark.getLayers().forEach((e) => {
          const layer = e as any;
          layer.editing.disable();
          if (that.drawStyle === 1) {
            that.moveLayer(layer);
          }
          else if (that.drawStyle === 2 || that.drawStyle === 3) {
            const center = layer.getCenter();
            that.moveLayer(layer, center);
            if (that.drawStyle === 2) {
              const polygon = that.turfLayer.getLayers()[0] as L.Polygon;
              that.moveLayer(polygon, center);
            }
          }
        });
      });

      this.editLayer = false;
      this.createLayer = false;
      this.editDrawHandler = new L.EditToolbar.Edit(
        this.currentMap as any,
        {
          featureGroup: this.layerDrawLandmark,
        } as any
      );

      const tempCir = this.leafletSv.createCircle(
        mapObject?.center.lat,
        mapObject?.center.lng,
        {
          radius: this.radiusLandmark,
          color: this.colorLandmark,
          fill: true,
          fillColor: this.colorLandmark,
          // fillOpacity: 0.5,
          // weight: 1.5
        }
      );
      this.layerDrawLandmark.addLayer(tempCir);
      this.editDrawHandler._enableLayerEdit(tempCir);
      this.createLayerBusy = true;
    }
    if (mapObject?.eType && mapObject?.eType === 'update-landmark') {
      if (this.editLandmark) {
        this.isCreate = false;
        this.landmarkid = this.editLandmark.id;
        const lat = this.roundToDecimal(this.editLandmark.latitude);
        const lng = this.roundToDecimal(this.editLandmark.longitude);
        this.latLng = `${lat}, ${lng}`;
        this.address = this.editLandmark.address;
        this.privateName = this.editLandmark.privateName;
        this.selectedLandmarkGroupIDs = this.editLandmark.groupIDs.length > 0 ? this.editLandmark.groupIDs[0] !== -1 ? this.editLandmark.groupIDs : [] : [];
        this.selectedCategoryId = this.editLandmark.categoryID;
        // Ẩn hiện input tốc độ
        // this.showSpeedInput = this.selectedCategoryId && [107, 202].includes(this.selectedCategoryId);
        this.nameLandmark = this.editLandmark.name;
        // this.colorLandmark = MapHelper.intToHexColor(this.editLandmark.color);
        this.pointLatLng = new L.LatLng(lat, lng);
        this.drawStyle = mapObject?.changeStyleToCircle || this.editLandmark.isManagementByCircle ? 1 : this.editLandmark.isClosed ? 3 : 2;
        this.radiusLandmark = this.editLandmark.radius;
        this.speedAllows = this.editLandmark.highwayVelocityAllow;
        this.editLayer = true;
        this.createLayer = false;

        this.editDrawHandler = new L.EditToolbar.Edit(
          this.currentMap as any,
          {
            featureGroup: this.layerDrawLandmark,
          } as any
        );

        this.tempMarker = this.createTempMarker(
          mapObject?.changeStyleToCircle ? mapObject?.center : this.pointLatLng,
          this.nameLandmark,
          this.editLandmark.icon
        );
        this.tempMarker?.on('dragend', function () {
          const pos = new L.LatLng(0, 0) //this.getLatLng(); // lấy thông tin điểm hiện tại
          const newLat = that.roundToDecimal(pos.lat);
          const newLng = that.roundToDecimal(pos.lng);
          that.latLng = `${newLat}, ${newLng}`;
          that.pointLatLng = new L.LatLng(newLat, newLng);
          that.getAddress(); //Lấy thông tin địa chỉ

          that.editLayer = false;
          that.createLayer = false;

          that.layerDrawLandmark.getLayers().forEach((e) => {
            const layer = e as any;
            layer.editing.disable();
            // Update vị trí vùng bao theo vị trí điểm
            if (that.drawStyle === 1) {
              that.moveLayer(layer);
            }
            else if (that.drawStyle === 2 || that.drawStyle === 3) {
              const center = layer.getCenter();
              that.moveLayer(layer, center);
              if (that.drawStyle === 2) {
                const polygon = that.turfLayer.getLayers()[0] as L.Polygon;
                that.moveLayer(polygon, center);
              }
            }
          });
        });
        this.currentMap?.addLayer(this.tempMarker);

        if (mapObject?.changeStyleToCircle) {
          this.tempSurround = this.leafletSv.createCircle(
            mapObject?.center.lat,
            mapObject?.center.lng,
            {
              radius: this.radiusLandmark,
              color: this.colorLandmark,
              fill: true,
              fillColor: this.colorLandmark,
              fillOpacity: 0.5,
              weight: 1.5
            });
        }
        else if (this.editLandmark.isManagementByCircle) {
          this.tempSurround = this.leafletSv.createCircle(
            this.editLandmark.latitude,
            this.editLandmark.longitude,
            {
              radius: this.editLandmark.radius, fill: true, fillColor: this.colorLandmark, fillOpacity: 0.5, color: this.colorLandmark, weight: 1.5
            }
          );
        }
        else {
          if (this.editLandmark.isClosed) {
            if (this.editLandmark.polygon) {
              const arrTemp = this.editLandmark.polygon.split(',');
              const listPoint: any[] = [];
              for (let index = 0; index < arrTemp.length; index++) {
                listPoint.push({
                  lng: Number.parseFloat(arrTemp[index]),
                  lat: Number.parseFloat(arrTemp[index + 1]),
                });
                index++;
              }
              this.tempSurround = this.leafletSv.createPolygon(
                listPoint,
                {
                  fill: true, fillColor: this.colorLandmark, fillOpacity: 0.5, color: this.colorLandmark, weight: 1.5
                }
              );
            }
          }
          else {
            if (this.editLandmark.polyline && this.editLandmark.polyline) {
              // Vẽ Line
              const arrTemp = this.editLandmark.polyline.split(',');
              const listPoint: L.LatLngLiteral[] = [];
              for (let index = 0; index < arrTemp.length; index++) {
                listPoint.push({
                  lng: Number.parseFloat(arrTemp[index]),
                  lat: Number.parseFloat(arrTemp[index + 1]),
                });
                index++;
              }
              this.tempSurround = this.leafletSv.createPolyline(
                listPoint,
                { color: this.colorLandmark, weight: 1.5 }
              );
            }
          }
        }

        this.layerDrawLandmark.addLayer(this.tempSurround);
        this.editDrawHandler._enableLayerEdit(this.tempSurround);
        this.createLayerBusy = true;
      }
    }

  }

  onLandmarkCategoryChanged(selectedCategory: LandmarkCategory) {
    // Đổi icon theo loại điểm
    if (selectedCategory?.icon) {
      this.tempMarker.updateIcon({ iconUrl: selectedCategory.icon });
    }
    // Ẩn hiện input tốc độ
    // this.showSpeedInput = this.selectedCategoryId && [107, 202].includes(this.selectedCategoryId);
  }

  moveLayer(layer: L.Circle | L.Polyline | L.Polygon, center?: L.LatLng | any) {
    if (layer) {
      if (layer instanceof L.Circle) {
        layer.setLatLng(this.pointLatLng);
      }
      else if (layer instanceof L.Polyline) {
        let layerPoints: L.LatLng[] = (layer.getLatLngs() as any) ?? [];
        if (layerPoints.length) {
          if (Array.isArray(layerPoints[0])) {
            layerPoints = layerPoints[0];
          }

          if (layerPoints.length) {
            const newPoints: L.LatLng[] = [];
            for (let i = 0; i < layerPoints.length; i++) {
              newPoints.push(new L.LatLng(layerPoints[i].lat - center.lat + this.pointLatLng.lat, layerPoints[i].lng - center.lng + this.pointLatLng.lng));
            }
            layer.setLatLngs(newPoints);
          }
        }
      }
    }
  }

  createTempMarker(latlng: L.LatLng, label: string, icon = ''): L.Marker {
    if (this.tempMarker) {
      this.currentMap?.removeLayer(this.tempMarker);
    }
    this.tempSurround?.remove();

    let lIcon = 'assets/images/common/point.png';
    if (icon && icon !== '') {
      lIcon = this.editLandmark.icon;
    }
    const temp = this.leafletSv.createMarker(latlng.lat, latlng.lng, {
      iconOptions: {
        iconUrl: lIcon,
        labelContent: label,
        className: 'custom-marker-icon-landmark'
      },
      draggable: true
    }, this.editLandmark ? this.editLandmark : new Landmark());
    return temp;
  }

  async getAddress() {
    // this.address = common.getTranslate(LanguageKeys.CommonKeys.Loading);
    // this.address = await this.addressSv.getAddress(this.pointLatLng.lat, this.pointLatLng.lng).asPromise();
    // if (this.address) {
    //   this.currentMap?.panTo(this.pointLatLng);
    // }
    // else {
    //   this.address = '';
    // }
  }

  onClose() {
    this.isShow = false;

    // this.obsSv.isFormLandmarkInputShowing.next(false);
  }

  save() {
    // ValidateHelper.validateForm(this.formRef);
    // if (this.formRef.invalid) {
    //   common.notificationError(LanguageKeys.CommonKeys.InputInvalid);
    // }
    // else {
    //   if (!this.selectedCategoryId) {
    //     return;
    //   }
    //   if (!this.nameLandmark) {
    //     common.notificationError(LanguageKeys.LandmarkKeys.EnterLandmark);
    //     return;
    //   }
    //   if (!this.latLng || !this.address || !this.pointLatLng) {
    //     common.notificationError(LanguageKeys.LandmarkKeys.ClickMapGetLocationAddress);
    //     return;
    //   }
    //   if (!this.layerDrawLandmark || this.layerDrawLandmark.getLayers().length < 1) {
    //     common.notificationError(LanguageKeys.LandmarkKeys.DrawOnMapToCreateLandmark);
    //     return;
    //   }
    //   if (this.drawStyle == 1 && !this.radiusLandmark) {
    //     common.notificationError(LanguageKeys.LandmarkKeys.RadiusMustNotEmptyIfCircle);
    //     return;
    //   }

    //   const intColor = MapHelper.hexColorToInt(this.colorLandmark.slice(1));

    // const landmark = {
    //   lid: this.landmarkid,
    //   lname: this.nameLandmark,
    //   pname: this.privateName,
    //   addr: this.address,
    //   rad: this.radiusLandmark,
    //   lat: this.pointLatLng.lat,
    //   lng: this.pointLatLng.lng,
    //   isys: false,
    //   ivis: this.displayLandmark ? 1 : 0,
    //   ilma: this.controlLandmark ? 1 : 0,
    //   icir: true,
    //   // colo: intColor,
    //   pgon: '', // lng,lat,lng,lat,lng,lat
    //   pline: '',
    //   desc: this.description,
    //   iclo: false,
    //   lgids: this.selectedLandmarkGroupIDs.join(','),
    //   lcid: this.selectedCategoryId,
    //   // cid: common.currentUser.companyId,
    //   proid: 0,
    //   // langid: common.currentLanguageId,
    //   vallow: this.speedAllows
    // };


    if (this.isCreate) {
      // this.subscriptions.add(
      //   this.landmarkSv.createLandMark(landmark).subscribe(
      //     landmark => {
      //       if (landmark) {
      //         const category = this.dicCategory.get(landmark.categoryID);
      //         if (category) {
      //           landmark.categoryName = common.getTranslate(category.resourceCode);
      //           landmark.icon = category.icon;
      //         }
      //         this.obsSv.landmarkSubjects.refreshListLanmark.next({ landmark, action: 1 });
      //         common.notificationSuccess(LanguageKeys.CommonKeys.InsertSuccess);
      //         this.onClose();
      //       }
      //     }
      //   )
      // );
    }
    else {
      // this.subscriptions.add(
      //   this.landmarkSv.updateLandMark(landmark).subscribe(
      //     landmark => {
      //       if (landmark) {
      //         const category = this.dicCategory.get(landmark.categoryID);
      //         if (category) {
      //           landmark.categoryName = common.getTranslate(category.resourceCode);
      //           landmark.icon = category.icon;
      //         }
      //         this.obsSv.landmarkSubjects.refreshListLanmark.next({ landmark, action: 2 });
      //         common.notificationSuccess(LanguageKeys.CommonKeys.UpdateSuccess);
      //         this.onClose();
      //       }
      //     }
      //   )
      // );
    }

    if (this.editLandmark?.id && this.editLandmark?.id > 0) {
      this.editLandmark.categoryID = this.selectedLandmarkCategoryIds;
      this.editLandmark.groupIDs = this.selectedLandmarkGroupIDs;
      this.editLandmark.name = this.nameLandmark;
      this.editLandmark.privateName = this.privateName;
      if (this.latLng && this.latLng?.split(',')?.length == 2) {
        const latlng = this.latLng.split(',');
        this.editLandmark.latitude = Number(latlng[0]);
        this.editLandmark.longitude = Number(latlng[1]);
      }
      this.editLandmark.address = this.address;
      this.editLandmark.color = 255;
      this.editLandmark.icon = this.listLandmarkCategorys.find(e => e.id == this.selectedLandmarkCategoryIds)?.icon ?? '';
      this.editLandmark.colorString = this.colorLandmark;
      if (this.drawStyle === 1) {
        // Hình tròn
        this.editLandmark.radius = this.radiusLandmark;
        this.editLandmark.isManagementByCircle = true;
      }
      else if (this.drawStyle === 2) {
        // đường
        const layer = this.layerDrawLandmark.getLayers()[0] as any;
        const polylineList: any[] = [];
        layer.getLatLngs().forEach((p: { lng: any; lat: any; }) => {
          polylineList.push([p.lng, p.lat]);
        });
        this.editLandmark.polyline = polylineList.join(',');

        if (this.turfLayer && this.turfLayer.getLayers().length > 0) {
          const polygon = this.turfLayer.getLayers()[0] as any;
          const pointList: any[] = [];
          polygon.getLatLngs().forEach((p: any[]) => {
            p.forEach((l) => {
              pointList.push([l.lng, l.lat]);
            });
          });
          this.editLandmark.polygon = pointList.join(',');
        }
        this.editLandmark.isManagementByCircle = false;
      }
      else if (this.drawStyle === 3) {
        // Đa giác
        this.editLandmark.isClosed = true;
        this.editLandmark.isManagementByCircle = false;
        const layer = this.layerDrawLandmark.getLayers()[0] as any;
        const pointList: any[] = [];
        layer.getLatLngs().forEach((p: { lng: any; lat: any; }[]) => {
          p.forEach((l: { lng: any; lat: any; }) => {
            pointList.push([l.lng, l.lat]);
          });
        });
        this.editLandmark.polygon = pointList.join(',');
      }
      else {
        this.toastr.warning('Vui lòng chọn kiểu vẽ');
        return;
      }
      this.modalSave.emit(this.editLandmark);
    } else {
      const newLandmark = new Landmark();
      newLandmark.radius = this.drawStyle == 1 ? this.radiusLandmark : 0;
      newLandmark.categoryID = this.selectedLandmarkCategoryIds;
      newLandmark.groupIDs = this.selectedLandmarkGroupIDs;
      newLandmark.name = this.nameLandmark;
      newLandmark.privateName = this.privateName;
      if (this.latLng && this.latLng?.split(',')?.length == 2) {
        const latlng = this.latLng.split(',');
        newLandmark.latitude = Number(latlng[0]);
        newLandmark.longitude = Number(latlng[1]);
      }
      newLandmark.address = this.address;
      newLandmark.color = 255;
      newLandmark.icon = this.listLandmarkCategorys.find(e => e.id == this.selectedLandmarkCategoryIds)?.icon ?? '';

      if (this.drawStyle === 1) {
        // Hình tròn
        newLandmark.radius = this.radiusLandmark;
        newLandmark.isManagementByCircle = true;
      }
      else if (this.drawStyle === 2) {
        // đường
        const layer = this.layerDrawLandmark.getLayers()[0] as any;
        const polylineList: any[] = [];
        layer.getLatLngs().forEach((p: { lng: any; lat: any; }) => {
          polylineList.push([p.lng, p.lat]);
        });
        newLandmark.polyline = polylineList.join(',');

        if (this.turfLayer && this.turfLayer.getLayers().length > 0) {
          const polygon = this.turfLayer.getLayers()[0] as any;
          const pointList: any[] = [];
          polygon.getLatLngs().forEach((p: any[]) => {
            p.forEach((l) => {
              pointList.push([l.lng, l.lat]);
            });
          });
          newLandmark.polygon = pointList.join(',');
        }
        newLandmark.isManagementByCircle = false;
      }
      else if (this.drawStyle === 3) {
        // Đa giác
        newLandmark.isClosed = true;
        newLandmark.isManagementByCircle = false;
        const layer = this.layerDrawLandmark.getLayers()[0] as any;
        const pointList: any[] = [];
        layer.getLatLngs().forEach((p: { lng: any; lat: any; }[]) => {
          p.forEach((l: { lng: any; lat: any; }) => {
            pointList.push([l.lng, l.lat]);
          });
        });
        newLandmark.polygon = pointList.join(',');
      }
      else {
        this.toastr.warning('Vui lòng chọn kiểu vẽ');
        return;
      }
      this.currentMap?.removeLayer(this.tempMarker);
      this.modalSave.emit(newLandmark);
    }


    this.hide();
  }

  createDraw() {
    this.clearDraw();
    if (this.currentMap) {
      this.createLayerBusy = true;
      if (this.drawStyle === 1) {
        const circleOptions: L.DrawOptions.CircleOptions = {
          showRadius: true,
          shapeOptions: {
            stroke: true,
            color: this.colorLandmark,
            weight: 1.5,
            opacity: 1,
            fill: true,
            fillColor: this.colorLandmark,
            fillOpacity: 0.5,
          },
        };
        this.circleDrawer = new L.Draw.Circle(
          this.currentMap as any,
          circleOptions
        );
        this.circleDrawer.enable();
      }
      else if (this.drawStyle === 2) {
        const polylineOptions: L.DrawOptions.PolylineOptions = {
          shapeOptions: {
            stroke: true,
            color: this.colorLandmark,
            weight: 1.5,
            opacity: 1,
            fillColor: this.colorLandmark, // same as color by default
            fillOpacity: 0.5,
          },
        };
        this.polylineDrawer = new L.Draw.Polyline(
          this.currentMap as any,
          polylineOptions
        );
        this.polylineDrawer.enable();

      }
      else if (this.drawStyle === 3) {
        const polygonOptions: L.DrawOptions.PolygonOptions = {
          showArea: false,
          allowIntersection: false,
          shapeOptions: {
            stroke: true,
            color: this.colorLandmark,
            weight: 1.5,
            opacity: 1,
            fill: true,
            fillColor: this.colorLandmark, // same as color by default
            fillOpacity: 0.5,
            clickable: true,
          },
        };
        this.polygonDrawer = new L.Draw.Polygon(
          this.currentMap as any,
          polygonOptions
        );
        this.polygonDrawer.enable();
      }
      else {
        this.toastr.warning('Lỗi khi chọn kiểu vẽ');
      }
    }
    else {
      this.toastr.warning('Lỗi thông tin bản đồ');
    }
  }

  coorChange(e: any) {
    if (e) {
      e = e + '';
      const arrLatlng = e.split(',');
      if (arrLatlng && arrLatlng.length > 1) {
        const newLatLng = new L.LatLng(arrLatlng[0], arrLatlng[1]);
        this.currentMap?.panTo(newLatLng);
        this.tempMarker.setLatLng(newLatLng);
        const newCoor = this.tempMarker.getLatLng();
        this.pointLatLng = new L.LatLng(this.roundToDecimal(newCoor.lat), this.roundToDecimal(newCoor.lng));
        const surround = this.layerDrawLandmark.getLayers()[0] as L.Circle;
        surround.setLatLng(newLatLng);
      }
    }
  }

  unmodifiedLatLng!: L.LatLng;
  setUnmodifiedLatLng() {
    this.unmodifiedLatLng = this.pointLatLng;
  }

  checkAddress() {
    if (this.pointLatLng.lat != this.unmodifiedLatLng.lat || this.pointLatLng.lng != this.unmodifiedLatLng.lng) {
      this.getAddress();
    }
  }

  changeColor(color: string) {
    if (
      this.layerDrawLandmark &&
      this.layerDrawLandmark.getLayers().length > 0
    ) {
      this.editDrawHandler = new L.EditToolbar.Edit(
        this.currentMap as any,
        {
          featureGroup: this.layerDrawLandmark,
        } as any
      );
      this.layerDrawLandmark.getLayers().forEach((e) => {
        const layer = e as any;
        layer.options.color = color;
        layer.options.fillColor = color;
        this.editDrawHandler._enableLayerEdit(layer);
        layer.editing.disable();

        if (this.drawStyle === 2) {
          if (this.turfLayer) {
            // xóa đường bao của đường
            this.turfLayer.clearLayers();
          }
          this.drawBorderPolyline(layer);
        }
      });
      this.editDrawHandler.save();
    }
  }

  changeStyle() {
    this.clearDraw();
    if ((this.drawStyle === 1 || this.drawStyle === 2) && !this.radiusLandmark) {
      this.radiusLandmark = 100;
    }
    // Nếu là đường tròn và đã có radius thì vẽ luôn vùng bao
    if (this.drawStyle === 1 && this.radiusLandmark && this.tempMarker) {

      this.createLayerBusy = false;
      // this.obsSv.mapInitInfo.next({
      //   map: this.currentMap,
      //   zoom: this.currentMap.getZoom(),
      //   center: this.tempMarker.getLatLng(),
      //   eType: this.isCreate ? 'contextmenu' : 'update-landmark',
      //   changeStyleToCircle: true
      // });

      const mapObject = {
        zoom: this.currentMap.getZoom(),
        center: this.tempMarker.getLatLng(),
        eType: this.isCreate ? 'contextmenu' : 'update-landmark',
        changeStyleToCircle: true
      }
      this.initDraw(mapObject);
    }
  }

  updateRadius() {
    this.layerDrawLandmark.getLayers().forEach((e) => {
      const layer = e as any;
      if (this.drawStyle === 1) {
        layer.setRadius(Math.round(this.radiusLandmark));
      }
      else if (this.drawStyle === 2) {
        if (this.turfLayer) {
          // xóa đường bao của đường
          this.turfLayer.clearLayers();
        }
        this.drawBorderPolyline(layer);
      }
    });
  }

  saveDraw() {
    this.editDrawHandler.save();
    this.editLayer = false;
    this.createLayer = false;
    this.layerDrawLandmark.getLayers().forEach((e) => {
      const layer = e as any;
      if (layer.editing.enabled()) {
        layer.editing.disable();
        if (this.drawStyle === 1) {
          this.radiusLandmark = Math.round(layer.getRadius());
        }
        else if (this.drawStyle === 2) {
          this.drawBorderPolyline(layer);
          this.moveTempMarkerToCenterShape(layer);
        }
        else {
          this.moveTempMarkerToCenterShape(layer);
        }
      }
    });
  }

  editDraw() {
    this.editLayer = true;
    this.editDrawHandler = new L.EditToolbar.Edit(
      this.currentMap as any,
      {
        featureGroup: this.layerDrawLandmark,
      } as any
    );
    this.layerDrawLandmark.getLayers().forEach(layer => {
      // this.moveLayer(layer as any);
      this.editDrawHandler._enableLayerEdit(layer);
    });
    if (this.turfLayer) {
      // xóa đường bao của đường
      this.turfLayer.clearLayers();
    }
  }

  /** Di chuyển Temp marker vào giữa Polygon hoặc Polyline */
  moveTempMarkerToCenterShape(shape: L.Polyline | L.Polygon) {
    if (this.tempMarker) {
      const center = shape.getCenter();
      const lat = this.roundToDecimal(center.lat);
      const lng = this.roundToDecimal(center.lng);
      this.pointLatLng = new L.LatLng(lat, lng);
      this.tempMarker.setLatLng(this.pointLatLng);
      this.latLng = `${lat}, ${lng}`;
    }
    this.getAddress();
  }

  cancelDraw() {
    this.editDrawHandler?.revertLayers();
    this.editLayer = false;
    this.layerDrawLandmark?.getLayers().forEach((e) => {
      const layer = e as any;
      if (layer.editing.enabled()) {
        layer.editing.disable();
        if (this.drawStyle === 1) {
          this.radiusLandmark = Math.round(layer.getRadius());
        }
        else if (this.drawStyle === 2) {
          this.drawBorderPolyline(layer);
          this.moveTempMarkerToCenterShape(layer);
        }
        else {
          this.moveTempMarkerToCenterShape(layer);
        }
      }
    });
  }

  drawBorderPolyline(layer: any) {
    const pointList: any[] = [];
    layer.getLatLngs().forEach((p: { lng: any; lat: any; }) => {
      pointList.push([p.lng, p.lat]);
    });
    const lineString = turf.lineString(pointList);
    let radius = 100;
    if (this.radiusLandmark) {
      radius = this.radiusLandmark;
    }
    const buffered = turf.buffer(lineString, radius, { units: 'meters' });
    this.turfLayer.addData(buffered);
  }

  removeBorderPolyline() {
    this.turfLayer?.clearLayers();
  }

  eventDrawMap() {
    L.EditToolbar.Delete.include({
      enable: () => { },
    });
    this.currentMap?.on('draw:created', (e) => {
      this.drawCreated(e);
      this.createLayerBusy = false;
    }, this);
    this.currentMap?.on('draw:deleted', () => {
      this.clearDraw();
    });
  }

  drawCreated(e: L.LeafletEvent) {
    this.createLayer = false;
    this.layerDrawLandmark.addLayer(e.layer);
    if (this.drawStyle === 1) {
      this.radiusLandmark = Math.round(e.layer.getRadius());
    }
    else if (this.drawStyle === 2) {
      this.drawBorderPolyline(e.layer);
      this.moveTempMarkerToCenterShape(e.layer);
    }
    else {
      this.moveTempMarkerToCenterShape(e.layer);
    }
  }

  clearDraw() {
    this.createLayer = true;
    this.editLayer = false;
    if (this.layerDrawLandmark) {
      this.layerDrawLandmark.clearLayers();
    }
    if (this.turfLayer) {
      // xóa đường bao của đường
      this.turfLayer.clearLayers();
    }

    if (this.polygonDrawer) {
      this.polygonDrawer.disable();
    }
    if (this.circleDrawer) {
      this.circleDrawer.disable();
    }
    if (this.polylineDrawer) {
      this.polylineDrawer.disable();
    }
  }

  /** Làm tròn số đến 6(mặc định) chữ số sau dấu phẩy */
  roundToDecimal(number: number) {
    const pow = 10 ** 6;
    return Math.trunc(number * pow) / pow;
  }
}

