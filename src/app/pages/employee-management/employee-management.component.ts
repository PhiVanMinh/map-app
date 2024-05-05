import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { finalize } from 'rxjs/operators';

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { CreateOrEditEmployeeComponent } from './create-or-edit-employee/create-or-edit-employee.component';
import { ConfirmModalComponent } from 'src/app/_components/share/modal/confirm-modal/confirm-modal.component';
import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Employee } from 'src/app/_models/employee';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})

  /** Quản lý người dùng
   * Name       Date          Comment
   * minhpv   04/07/2023      created
   * minhpv   09/08/2023      updated
  */

export class EmployeeManagementComponent implements AfterViewChecked , OnInit {
  @ViewChild('createOrEditEmployee', { static: true }) createOrEditEmployee: CreateOrEditEmployeeComponent | undefined;
  @ViewChild('confirmModal', { static: true }) confirmModal: ConfirmModalComponent | undefined;

  // Giá trị lọc
  valueFilter!: string;
  typeFilter: number = 1;
  gender: number = 0;
  fromDate: Date = new Date();
  toDate: Date = new Date();

  // Phân trang
  page = 1;
	pageSize = 10;
  collectionSize = 0;
  
  rowData: Employee[] | undefined;
  selectedEmployee!: Employee;
  currentUser!: Employee;
  roles: string[] = [];

  minDate: Date | undefined;
  maxDate: Date | undefined;

  constructor(
    public translate: TranslateService,
	  private toastr: ToastrService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private _cdr: ChangeDetectorRef
    ,private _http: HttpClient
    ) {
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
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
   * Tìm kiếm thông tin user theo điều kiện
  */
  search(){
    
	if (this.fromDate && this.toDate && moment(this.fromDate).isAfter(moment(this.toDate)))
	{
		this.toastr.warning(' Từ ngày phải nhỏ hơn đến ngày');
		return;
	}

  if (this.fromDate && this.toDate && moment(this.toDate).add(-1, 'months').isAfter(moment(this.fromDate)))
	{
		this.toastr.warning(' Vui lòng nhập trong khoảng thời gian 1 tháng');
		return;
	}

  if(!this.valueFilter && this.gender < 1 && !this.fromDate && !this.toDate){
    this.toastr.warning(' Vui lòng hãy nhập 1 giá trị tìm kiếm !');
		return;
  }

   let body = {
    gender: this.gender,
    fromDate: this.fromDate,
    toDate: this.toDate,
    page: this.page,
    pageSize: this.pageSize,

    userName: this.typeFilter == 1 ? this.valueFilter : undefined,
    fullName: this.typeFilter == 2 ? this.valueFilter : undefined,
    email: this.typeFilter == 3 ? this.valueFilter : undefined,
    phoneNumber: this.typeFilter == 4 ? this.valueFilter : undefined,
   }
   this._cdr.markForCheck();
   this.userService.getEmployees(body).pipe(finalize(() => { this._cdr.detectChanges(); })).subscribe(
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
   * TODO: Show modal update
   * Mở giao diện cập nhật, truyền vào dữ liệu cần cập nhật
   * @param selectedEmployee - thông tin người dùng được chọn
  */
  edit(selectedEmployee?: Employee){
	  this.createOrEditEmployee?.show(selectedEmployee);
  }
 
  /** 
   * TODO: Hàm gọi sau khi cập nhật thành công
   * Dùng để làm mới danh sách người dùng sau khi cập nhật
   * @param user - thông tin người dùng đã cập nhật
  */
  modalSave(user?: Employee){
      this.typeFilter = 1;
      this.valueFilter = user?.userName ?? '';
      this.search();
  }

  /** 
   * TODO: Xóa 1 bản ghi
   * Dùng để ghi nhận xóa 1 thông tin người dùng, hiển thị message confirm
   * @param value - thông tin người dùng cần xóa
  */
  delete(value: Employee){
    this.selectedEmployee = value;
    this.confirmModal?.show(undefined, 1)
  }

  /** 
   * TODO: Xóa nhiều bản ghi cùng lúc
   * Dùng để ghi nhận xóa nhiều thông tin người dùng, hiển thị message confirm
  */
  deleteRange(){
    this.confirmModal?.show(undefined, 2)
  }

  /** 
   * TODO: Hàm thực hiện xóa sau khi xác nhận
   * Dùng để thực hiện xóa thông tin người dùng sau khi xác nhận xóa
   * @param value - loại hình xóa 1 bản ghi (1) hay nhiều bản ghi (2)
  */
  acceptDelete(value?: number) {
    let listIds = [];
    // Xóa 1 bản ghi
    if(value == 1) {
      listIds.push(this.selectedEmployee?.userId)
    }
    // Xóa nhiều bản ghi - Lấy ra danh sách bản ghi đã chọn để xóa
    if(value == 2) {
      this.rowData?.filter(e => e.selected).forEach(e => listIds.push(e.userId))
    }
    let body = { 
      listId: listIds, 
      currentUserId: this.authenticationService.currentUserValue?.userId, 
      currentEmpName: this.authenticationService.currentUserValue?.empName 
    }
    this.userService.deleteEmployee(body).subscribe({
      next: res => {
        if(!res.statusCode)
        {
          this.toastr.success(' Xóa thành công  !');
          this.search()
        } else {
          if( res.statusCode === 400 ) this.toastr.warning(res.message);
          else this.toastr.warning('Thực hiện không thành công. Vui lòng làm mới và thực hiện lại !');
        }
      },
      error: (err) => {
          if(err.status === 400 ) this.toastr.warning(err.error);
          else this.toastr.error('Thực hiện không thành công. Vui lòng làm mới và thực hiện lại !');
      }
    })
  }

  /** 
   * TODO: Hàm thực hiện xuất báo cáo excel
   * Dùng để xuất báo cáo excel
  */
  exportExcel() {
    let body = {
      // valueFilter: this.valueFilter,
      // typeFilter: this.typeFilter,
      gender: this.gender,
      fromDate: this.fromDate,
      toDate: this.toDate,
      page: this.page,
      pageSize: this.pageSize,

      userName: this.typeFilter == 1 ? this.valueFilter : undefined,
      fullName: this.typeFilter == 2 ? this.valueFilter : undefined,
      email: this.typeFilter == 3 ? this.valueFilter : undefined,
      phoneNumber: this.typeFilter == 4 ? this.valueFilter : undefined,
     }

      var year = moment().format("YYYY").substring(2);
      var month = moment().format("MM");
      var date = moment().format("DD");
      var hour = moment().format("HH");
      var minute = moment().format("mm");    

      // this.userService.exportExcel(body)
      // .subscribe(response => {
      //   const blob = new Blob([response], {
      //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      //   });
      //    saveAs(blob, `UserList_${year}${month}${date}${hour}${minute}.xlsx`)
      // });
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
      this.maxDate = new Date(moment(this.fromDate).add(1,'months').toString());
    } 
  }

}



