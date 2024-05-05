import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { SpeedViolationVehicle } from 'src/app/_models/speed-violation-vehicle';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SpeedViolationService } from 'src/app/_services/speed-violation.service';
import * as saveAs from 'file-saver';

@Component({
  selector: 'report-speed-violation',
  templateUrl: './report-speed-violation.component.html',
  styleUrls: ['./report-speed-violation.component.scss']
})

  /** Thống kê vi phạm tốc độ theo đơn vị vận tải
   * Name       Date          Comment
   * minhpv   05/09/2023      created
  */
export class ReportSpeedViolationComponent implements OnInit {

  // Phân trang
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  rowData: SpeedViolationVehicle[] | undefined;

  // Thời gian lọc
  timeFromDate: any;
  timeToDate: any;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  minDate: Date | undefined;
  maxDate: Date | undefined;

  // lọc theo phương tiện
  dropdownList: { vehicleID: number; privateCode: string; }[] = [];
  selectedItems: { vehicleID: number; privateCode: string; }[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'vehicleID',
    textField: 'privateCode',
    selectAllText: 'Chọn tất cả',
    unSelectAllText: 'Bỏ chọn tất cả',
    itemsShowLimit: 20,
    allowSearchFilter: true
  };
  roles: string[] = [];

  constructor(
    private toastr: ToastrService,
    private _cdr: ChangeDetectorRef,
    private service: SpeedViolationService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.getVehicles();

    this.timeFromDate = moment().format('HH:mm');
    this.timeToDate = moment().format('HH:mm');

    this.roles = this.authenticationService.currentUserRoles;

  }

    // Check thay đổi sau khi khởi tạo component
    ngAfterViewChecked(): void {
      this._cdr.detectChanges();
    }

    // Thứ tự bản ghi đầu tiên đang hiển thị trên bảng
    get fromRecord() {
      if (this.collectionSize === 0) return 0;
      return (
          (this.page - 1) * this.pageSize + 1
      );
    }
  
    // Thứ tự bản ghi cuối cùng đang hiển thị trên bảng
    get toRecord() {
      let calcRecord =
        this.page * this.pageSize;
      return calcRecord > this.collectionSize
        ? this.collectionSize
        : calcRecord;
    }

  /** 
   * TODO: Tìm kiếm thông tin
   * Tìm kiếm thông tin xe theo đơn vị vận tải
  */
  getVehicles(){
    this._cdr.markForCheck();
    this.service.getListVehicle(this.authenticationService.currentUserValue?.companyId ?? 0).pipe(finalize(() => { this._cdr.detectChanges(); })).subscribe(
    res => {
      this.dropdownList = res;
    }
   )
  }

  /** 
   * TODO: Tìm kiếm thông tin
   * Tìm kiếm thông tin vi phạm tốc độ
  */
  search(resetPage?: boolean){
    this.calculateDateTime();
    if (this.fromDate && this.toDate && moment(this.fromDate).isAfter(moment(this.toDate)))
    {
      this.toastr.warning(' Từ ngày phải nhỏ hơn đến ngày');
      return;
    }
  
    if (this.fromDate && this.toDate && moment(this.toDate).add(-60, 'days').isAfter(moment(this.fromDate)))
    {
      this.toastr.warning(' Vui lòng nhập trong khoảng thời gian 60 ngày');
      return;
    }

    let vhcList: number[] = [];
    this.selectedItems.forEach(e => vhcList.push(e.vehicleID));

    if(resetPage) this.page = 1;

    let body = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      page: this.page,
      pageSize: this.pageSize,
      listVhcId: vhcList,
      companyId: this.authenticationService.currentUserValue?.companyId
     }
     this._cdr.markForCheck();
     this.service.getSpeedViolationVehicles(body).pipe(finalize(() => { this._cdr.detectChanges(); })).subscribe(
      res => {
          if(!res.statusCode)
          {
            this.collectionSize = res?.result?.totalCount;
            this.rowData = res?.result?.result != null ? Object.assign(res?.result?.result, {selected: false}) : [];
          } else this.toastr.warning('Không tìm thấy bản ghi phù hợp !');
      }
     )
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

  /** 
   * TODO: Hàm tính thời gian lọc trước khi tìm kiếm
  */
    calculateDateTime(){
      var offset = new Date().getTimezoneOffset();

      let fromTime = !this.timeFromDate ? null : this.timeFromDate.split(":");
      if(fromTime?.length > 0){
        this.fromDate.setHours(Number(fromTime[0])- (offset / 60));
        this.fromDate.setMinutes(Number(fromTime[1]));
      }  
      
      let toTime = !this.timeToDate ? null : this.timeToDate.split(":");
      if(toTime?.length > 0){
        this.toDate.setHours(Number(toTime[0]) - (offset / 60));
        this.toDate.setMinutes(Number(toTime[1]));
      }
    }

    
  /** 
   * TODO: Hàm thực hiện format giá trị phút về định dạng HH:mm
   * Dùng để thực hiện format giá trị phút về định dạng HH:mm cho cell trong bảng
   * @param value - giá trị cần chuyển đổi
  */
    formatMinuteToHourMinute(value: number){
      let hour = (value - (value % 60)) / 60;
      let minute =value % 60;
      return `${hour < 10 ? 0 : ''}${hour}:${minute < 10 ? 0 : ''}${minute}`
    }

  /** 
   * TODO: Hàm thực hiện định dạng giá trị số
   * Dùng để thực hiện format giá trị số theo ngôn ngữ
   * @param value - giá trị cần chuyển đổi
  */
    formatValueKm(value: number){
      return value ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}) : ''
    }

  /** 
   * TODO: Hàm thực hiện xuất báo cáo excel
   * Dùng để xuất báo cáo excel
  */
  exportExcel() {
    let vhcList: number[] = [];
    this.selectedItems.forEach(e => vhcList.push(e.vehicleID));
    let body = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      page: this.page,
      pageSize: this.pageSize,
      listVhcId: vhcList,
      companyId: this.authenticationService.currentUserValue?.companyId
     }

      var year = moment().format("YYYY").substring(2);
      var month = moment().format("MM");
      var date = moment().format("DD");
      var hour = moment().format("HH");
      var minute = moment().format("mm");    

      this.service.exportExcel(body)
      .subscribe(response => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
         saveAs(blob, `Speed_Violation_Report_${year}${month}${date}${hour}${minute}.xlsx`)
      });
  }
}
