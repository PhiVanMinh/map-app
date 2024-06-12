import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { VirtualTreeComponent } from 'src/app/_components/share/virtual-tree/virtual-tree.component';
import { LandmarkCategory } from 'src/app/_models/landmark/landmark-category';
import { LandmarkGroup } from 'src/app/_models/landmark/landmark-group';
import { Landmark } from 'src/app/_models/landmark/landmark.model';
import { RouteModel } from 'src/app/_models/route';
import { Vehicle } from 'src/app/_models/vehicle';
import { LeafletService } from 'src/app/_services/leaflet.service';
import { ConfirmModalComponent } from 'src/app/_components/share/modal/confirm-modal/confirm-modal.component';
import { AddOrEditLandmarkComponent } from '../landmark/add-or-edit-landmark/add-or-edit-landmark.component';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  @ViewChild('formInputLandmark', { read: ViewContainerRef, static: true }) formInputLandmarkComponentRef!: ViewContainerRef;
  isShowLeftPanel = true;
  @Input() vehicles: Vehicle[] = [];
  showConfigVisible!: boolean;
  showSystemStatusForm!: boolean;
  vehiclesByFilter!: Vehicle[] | undefined;
  routeByFilter!: RouteModel[] | undefined;
  // Tìm kiếm
  listSearchTypes: { dropdownText: string, placeHolder: string, iconUrl: string }[] = [
    {
      dropdownText: 'Tìm theo phương tiện',
      placeHolder: 'Nhập phương tiện',
      iconUrl: '/assets/images/online/left-panel/find-vehicle.png',
    },
    {
      dropdownText: 'Tìm theo địa chỉ',
      placeHolder: 'Nhập tên điểm',
      iconUrl: '/assets/images/online/left-panel/find-landmark.png',
    },
    {
      dropdownText: 'Tìm theo vị trí',
      placeHolder: 'Nhập vị trí',
      iconUrl: '/assets/images/online/left-panel/find-point.png',
    },
  ];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Chọn tất cả',
    unSelectAllText: 'Bỏ chọn tất cả',
    itemsShowLimit: 20,
    allowSearchFilter: true
  };

  dropdownVehicleSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'privateCode',
    // selectAllText: 'Chọn tất cả',
    // unSelectAllText: 'Bỏ chọn tất cả',
    // itemsShowLimit: 20,
    allowSearchFilter: true
  };
  currentSearchType = 0;
  leftPanelWidth = 300;

  privateCode: any;
  landmark: any;
  latlng: any;
  groupList: {id: number, name: string}[] = [{id: 1, name: 'Nhóm 1'}, {id: 2, name: 'Nhóm 2'}, {id: 3, name: 'Nhóm 3'},{id: 4, name: 'Nhóm 4'}];
  statusList: {id: number, name: string}[] = [{id: 1, name: 'Di chuyển'}, {id: 2, name: 'Dừng - bật'}, {id: 3, name: 'Dừng - tắt'},{id: 4, name: 'Quá tốc độ'}];
  selectedGroupIds: any;
  selectedStatusIds: any;
  selectedVehicleId: any

    // Thời gian lọc
  timeFromDate: any;
  timeToDate: any;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  minDate: Date | undefined;
  maxDate: Date | undefined;

 // Player
 @Input() currentKM!: number;
 currentIndex!: number;
 @Input() totalKM!: number;
 totalTimeStr!: string;
 totalTime!: number;
 totalTimeMachineOn!: string;
 totalTimeStop!: string;
 totalTimeMachineOnRaw!: number;
 currentSpeedLevel!: number;
 isPlaying!: boolean;
 isPlayStopped!: boolean;
 isPause!: boolean;
 interval: any;
 arraySpeed: { label: string; interval: number }[] = [];
 @Input() listRoutes: RouteModel[] = [];
  selectedState: any;

  @Input() type: number = 1;
  selectedVehicle: Vehicle = new Vehicle();
  selectedRoute: RouteModel = new RouteModel();
  selectedVhcList: any;
  @Output() emitVehicle: EventEmitter<Vehicle> = new EventEmitter();
  @Output() emitRoute: EventEmitter<RouteModel> = new EventEmitter();
  @Output() emitPlayRoute: EventEmitter<any> = new EventEmitter();


  // Điểm
  landmarkName!: string;
  showLandmarkName: boolean = true;
  showPolygon!: boolean;
  @Input() listLandmarks: Landmark[] = [];
  @Input() listLandmarkCategorys: LandmarkCategory[] = [];
  @Input() listLandmarkGroups: LandmarkGroup[] = [];
  @ViewChild(VirtualTreeComponent) virtualTree!: VirtualTreeComponent;
  countSelectedNode = 0;
  selectedCategoryIds: any;
  selectedLandmarkGroupIds: any;
  landmarkByFilter!: Landmark[] | undefined;
  @Input() map: any;
  @Output() emitLandmark: EventEmitter<any> = new EventEmitter();
  @Output() emitAddOrEditLandmark: EventEmitter<any> = new EventEmitter();
  @Output() emitRemoveLandmark: EventEmitter<any> = new EventEmitter();
  @Output() emitChangeCheckBox: EventEmitter<any> = new EventEmitter();
  selectedLandmark: any;

  @ViewChild('createOrEditLandmark', { static: true }) createOrEditEmployee!: AddOrEditLandmarkComponent;
  @ViewChild('tree', { static: true }) tree!: VirtualTreeComponent;

  constructor(
    private leafletService: LeafletService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.listRoutes = [];
    this.totalKM = 0;
    this.totalTimeMachineOn = 'Không xác định';
    this.totalTimeStop = 'Không xác định';
    this.currentKM = 0;
    this.currentIndex = 0;
    this.currentSpeedLevel = 3;
    this.arraySpeed = [
      { label: '1x', interval: 625 },
      { label: '2x', interval: 125 },
      { label: '4x', interval: 25 },
      { label: '8x', interval: 10 },
      { label: '16x', interval: 1 },
    ];
    this.isPlaying = false;
    this.isPlayStopped = false;
    this.isPause = true;
    this.timeFromDate = moment().startOf('day').format('HH:mm');
    this.timeToDate = moment().endOf('day').format('HH:mm');
  }

  getListVehicleInit(){

  }

  // Thay đổi loại tìm kiếm
  changeSearchType(searchType: number) {
    this.currentSearchType = searchType;
    this.cdr.detectChanges();
  }

    /**
 * TODO: Hàm thực hiện khi thay đổi giá trị từ ngày
*/
    changeDate(value: string){
      if (value == 'fromDate') {
        if(!this.fromDate) {
          this.maxDate = undefined;
          this.minDate = undefined;
        }
        this.minDate = this.fromDate;
        this.maxDate = new Date(moment(this.fromDate).add(60,'days').toString());
      }
  }

  // Player----------------------------------------------------------------------------
  changeRange(scrollToFirst?: boolean) {
    if (this.currentKM) {
      if (this.currentKM === 0) {
        this.currentIndex = 0;
      }
      else if (this.currentKM >= this.totalKM) {
        this.currentIndex = this.listRoutes.length - 1;
      }
      else {
        const nearIndex = this.listRoutes.findIndex((x: any) => x.km >= this.currentKM);
        if (nearIndex == 0) {
          this.currentIndex = nearIndex;
        }
        else if (nearIndex > 0) {
          const nearKmRange = this.listRoutes[nearIndex].kmGps - this.currentKM;
          const prevNearKmRange = Math.abs(this.currentKM - this.listRoutes[nearIndex - 1].kmGps);
          this.currentIndex = nearKmRange <= prevNearKmRange ? nearIndex : nearIndex - 1;

        }
        this.currentKM = this.listRoutes[this.currentIndex].kmGps;
      }
    }
    else {
      this.currentKM = 0;
      this.currentIndex = 0;
    }

    if (this.selectedState) {
      const route = this.listRoutes[this.currentIndex];
      if (route) {
        // const listByState = this.routeStatePipe.transform(this.listRoutes, this.selectedState);
        // const index = listByState.findIndex(x => x.index == route.index);
        // this.virtualScrollComponent.scrollToIndex(index);
      }
    }
    else {
      // Nếu tìm kiếm lần đầu thì trỏ vào bản ghi đầu tiên , xe xuất phát từ 0
      if (scrollToFirst) {
        // this.virtualScrollComponent.selectRow(this.currentIndex, false, false, scrollToFirst);
        // this.virtualScrollComponent.scrollToIndex(0);
        // this.virtualScrollComponent.currentRouteIndex = 0;
        this.currentIndex = 0;
        this.currentKM = 0;
      }
      else {
        // this.virtualScrollComponent.selectRow(this.currentIndex, true, false);
      }
    }
    // this.setStyleRange();
    this.pause();
  }

  play(isToEnd?: boolean, isPrint?: boolean) {
    if (this.listRoutes.length) {
      this.isPlaying = true;
      this.isPause = false;
      this.isPlayStopped = false;
      this.move(isToEnd, isPrint);
    }
  }

  move(isToEnd?: boolean, isPrint?: boolean) {
    this.interval = setInterval(() => {
      // Trỏ vào dòng trên danh sách
      // this.virtualScrollComponent.currentRouteIndex = this.currentIndex;
      // this.virtualScrollComponent.scrollToIndex(this.currentIndex);
      // Thay đổi vị trí slider
      this.currentKM = this.listRoutes[this.currentIndex].kmGps;
      // this.setStyleRange();
      // // Truyền sang map
      // this.obs.showRouteVehicle.next({
      //   index: this.currentIndex,
      //   isPlay: !isToEnd,
      //   speed: this.arraySpeed[this.currentSpeedLevel - 1].interval,
      //   isLast: false,
      //   isPrint: isPrint,
      // });

      this.emitPlayRoute.emit({
        index: this.currentIndex,
        isPlay: !isToEnd,
        speed: this.arraySpeed[this.currentSpeedLevel - 1].interval,
        isLast: false,
      });

      // Nhảy tới vị trí tiếp theo
      if (this.currentIndex < this.listRoutes.length - 1) {
        this.currentIndex += 1;
      }
      // Dừng nếu là dòng cuối
      else {
        this.isPlayStopped = true;
        this.isPlaying = false;
        this.isPause = false;
        clearInterval(this.interval);
      }
    }, this.arraySpeed[this.currentSpeedLevel - 1].interval);
  }

  pause() {
    this.isPlaying = false;
    this.isPause = true;
    this.isPlayStopped = false;
    clearInterval(this.interval);
  }

  rePlay() {
    this.isPlaying = true;
    this.isPause = false;
    this.isPlayStopped = false;
    this.currentIndex = 0;
    this.play();
  }

  toBegin() {
    if (this.currentIndex > 0) {
      this.currentIndex = 0;
      this.currentKM = 0;
      // this.virtualScrollComponent.selectRow(0, true, false);
      // // Vị trị slider
      // this.setStyleRange();

      if (this.isPlaying) {
        clearInterval(this.interval);
        this.play(false);
      }
      else {
        this.pause();
      }
    }
  }

  toEnd(isPrint?: boolean) {
    if (this.currentIndex < this.listRoutes.length - 1) {
      this.currentIndex = this.listRoutes.length - 1;
      // this.virtualScrollComponent.selectRow(this.currentIndex, true, false);
      clearInterval(this.interval);
      this.play(true, isPrint);
    }
  }

  speedUp() {
    if (this.currentSpeedLevel < 5) {
      this.currentSpeedLevel = this.currentSpeedLevel + 1;
      if (this.isPlaying) {
        clearInterval(this.interval);
        this.play();
      }
    }
  }

  reduceSpeed() {
    if (this.currentSpeedLevel > 1) {
      this.currentSpeedLevel = this.currentSpeedLevel - 1;
      if (this.isPlaying) {
        clearInterval(this.interval);
        this.play();
      }
    }
  }

  getRouteData(){
    this.currentKM = 0;
    this.emitVehicle.emit(this.selectedVehicleId);
  }

  selectVehicle(value: Vehicle){
    this.selectedVehicle = value;
    this.emitVehicle.emit(value)
  }

  selectRoute(value: RouteModel){
    this.selectedRoute = value;
    this.emitRoute.emit(value)
  }

  onChangeSelectedVehicleRoute(value: any){
    this.selectedVhcList = value;
    this.selectedVehicleId = value ? value[0] : undefined;
  }

  filterVehicle(value?: string){
    if(this.type == 1){
      if(value || this.selectedGroupIds || this.selectedStatusIds)
         this.vehiclesByFilter = this.vehicles.filter(e => {
          let ok = true;
          // Lọc theo điểm
          if (value && value != '') {
              ok = ok && e.privateCode.startsWith(value);
          }

          // Lọc theo nhóm phương tiện
          if (ok && this.selectedGroupIds?.length > 0) {
            ok = this.selectedGroupIds?.some((z: any) => z.id == e.groupId);
          }

          // Lọc theo trạng thái của phương tiện
          if (ok && this.selectedStatusIds?.length > 0) {
            ok = this.selectedStatusIds.some((s: any) => s.id == e.status);
          }

          return ok;
        });
      else this.vehiclesByFilter = undefined;
    } else {

    }
  }

  filterLandmark(value?: string){
    if(this.type == 3){
      if(value || this.selectedLandmarkGroupIds || this.selectedCategoryIds)
         this.landmarkByFilter = this.listLandmarks.filter(e => {
          let ok = true;
          // Lọc theo điểm
          if (value && value != '') {
              ok = ok && e.name.includes(value);
          }

          // Lọc theo nhóm phương tiện
          if (ok && this.selectedCategoryIds?.length > 0) {
            ok = this.selectedCategoryIds?.some((z: any) => z.id == e.categoryID);
          }

          // Lọc theo trạng thái của phương tiện
          if (ok && this.selectedLandmarkGroupIds?.length > 0) {
            ok = this.selectedLandmarkGroupIds.some((s: any) => e.groupIDs.some(g => g == s.id));
          }

          return ok;
        });
      else {
        this.landmarkByFilter = undefined;
      }
    }
  }

    // #region Handle sự kiện -------------------------------------------------------------------
  // Khi Virtual Tree tạo xong danh sách nodes
  finishCreateNodes() {
    if (this.virtualTree) {
      this.virtualTree.autoHeightVirtualTree();
    }
    this.cdr.detectChanges();
  }

  // Tự động đếm số node đã chọn khi Virtual Tree thay đổi
  countSelectedNodes() {
    if (this.virtualTree) {
      this.countSelectedNode = this.virtualTree.selectedNodes.length;
    }
    else {
      this.countSelectedNode = 0;
    }
  }

  onChangeSelectedLandmark(landmark: any){
    this.selectedLandmark = landmark
    this.emitLandmark.emit(landmark);
  }

  showModal(value?: any){
    // const component = this.leafletService.createComponent(LandmarkFormInputComponent, this.formInputLandmarkComponentRef);
    // component.instance.isShow = true;
    // component.instance.currentMap = this.map;
    // if(value) component.instance.editLandmark = value;

    const selectedLandmark = this.listLandmarks.find(e => e.id == value?.id);
    if(selectedLandmark)
    this.createOrEditEmployee?.show(selectedLandmark);
    else this.createOrEditEmployee?.show();

  }

  modalSave(value?: any){
    if(value.id > 0){
      // this.listLandmarks.forEach(e => {
      //   if(e.id == value.id){
      //     e = Object.assign(e, value);
      //   }
      // })

      this.listLandmarks = this.listLandmarks.filter(e => e.id != value.id);
      this.listLandmarks.push(value);
    } else {
      value.id = Math.floor(10000 + Math.random() * 90000);
      this.listLandmarks = this.listLandmarks.concat(value);
    }
    this.emitAddOrEditLandmark.emit(this.listLandmarks);
  }

  delete(value: any){
    this.selectedLandmark = value;
    this.confirmModal?.show(undefined, 1);
  }

  @ViewChild('confirmModal', { static: true }) confirmModal: ConfirmModalComponent | undefined;
  acceptDelete(value: any){
    this.listLandmarks = this.listLandmarks.filter(e => e.id != this.selectedLandmark.id);
    if( this.landmarkByFilter) this.landmarkByFilter = this.landmarkByFilter.filter(e => e.id != this.selectedLandmark.id);

    this.emitRemoveLandmark.emit(this.selectedLandmark);
  }

  changeCheckbox(){
    const dataChange = {showLandmarkName: this.showLandmarkName, showPolygon: this.showPolygon}
    this.emitChangeCheckBox.emit(dataChange);
  }
}
