import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm} from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { UserService } from 'src/app/_services/user.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models/user-infomation';
import { Employee } from 'src/app/_models/employee';


  /** Class thêm / sửa thông tin user
   * Name       Date          Comment
   * minhpv   20/07/2023      created
   * minhpv   04/08/2023      edited
  */
@Component({
  selector: 'create-or-edit-employee',
  templateUrl: './create-or-edit-employee.component.html',
  styleUrls: ['./create-or-edit-employee.component.scss']
})
export class CreateOrEditEmployeeComponent implements OnInit {

  @ViewChild('modal') public modal!: ModalDirective;
  @Output('modalSave') modalSave = new EventEmitter();
	@ViewChild('f') courseForm!: NgForm;

  form: User = new User();

  employee: Employee = new Employee();
  confirmPass!: string;
  password!: string;
  EmpTypes = [
    {
      label: 'Quản lý',
      value: 1,
    },
    {
      label: 'Nhân viên',
      value: 2,
    }
  ]
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {}

  // TODO: Hide modal - Làm mới form và ẩn modal
  hide() {
    this.courseForm.resetForm();
    this.modal.hide();
  }
  
   /** 
   * TODO: Show modal
   * Hiển thị giao diện thêm sửa thông tin nhân viên
   * @param selectedUser - thông tin người dùng được chọn từ màn hình hiển thị danh sách user
   * Nếu không có thông tin người dùng sẽ hiểu là tạo mới
  */
  show(selectedUser?: Employee) {
    this.courseForm.resetForm();

    setTimeout(() => {
    this.employee = selectedUser ?? new Employee();
      this.form.fullName = this.employee.empName,
      this.form.userName = this.employee.userName,
      this.form.email = this.employee.email,
      this.form.password = this.employee.password,
      this.form.birthDay = this.employee.birthDay,
      this.form.gender = this.employee.gender,
      this.form.phoneNumber = this.employee.phoneNumber,
      this.form.confirmPassword = this.employee.password,
      this.form.role = this.employee.role?.toString() ?? '2',

      this.modal.show();
    });

  }

  /** 
   * TODO: Submit
   * Lưu thông tin nhân viên đã nhập, thỏa mãn điều kiện
   * Nếu lưu thành công hệ thống sẽ báo thành công và đóng modal
   * Ngược lại nếu lỗi hệ thống đưa ra cảnh báo và không thực hiện thao tác tiếp theo
  */
  onSubmit() {
    this.employee.empName = this.form.fullName;
    this.employee.userName = this.form.userName;
    this.employee.email = this.form.email;
    if(!this.employee.userId) this.employee.password = this.form.password;
    this.employee.birthDay = this.form.birthDay;
    this.employee.gender = this.form.gender;
    this.employee.phoneNumber = this.form.phoneNumber;
    this.employee.role = Number(this.form.role);

    let body = Object.assign(this.employee, {currentUserId: this.authenticationService.currentUserValue?.userId});
    this.userService.createOrUpdateEmployee(body).subscribe({
      next: (res) => {
       
        if(!res.statusCode)
        {
          this.toastr.success('Lưu thành công !');
          this.modalSave.emit(this.employee);
          this.modal.hide();
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

  // Chặn nhập ký tự đặc biệt
  keypress(event: KeyboardEvent){
    let value = event.charCode;
    return((value > 64 && value < 91) || (value > 96 && value < 123) || value == 8 || value == 32 || (value >= 48 && value <= 57));
  }

  // Chặn nhập kí tự cho email
  keypressEmail(event: KeyboardEvent){
    let value = event.charCode;
    return((value >= 64 && value < 91) || (value > 96 && value < 123) || value == 46 || value == 8 || value == 32 || (value >= 48 && value <= 57));
  }

  // Chặn nhập kí tự cho SĐT
  keypressNumber(event: KeyboardEvent){
    let value = event.charCode;
    return(value == 8  || (value >= 48 && value <= 57));
  }


}
