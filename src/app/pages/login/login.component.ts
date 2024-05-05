import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { Employee } from 'src/app/_models/employee';
import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})

  /** Class màn hình đăng nhập 
   * Name       Date          Comment
   * minhpv   27/06/2023      created
   * minhpv   04/07/2023      edited
  */

export class LoginComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  // Giá trị trong form login
  userName: string | undefined;
  password: string | undefined;
  rememberMe!: boolean;

  screenWidth!: number;

  returnUrl: string | undefined;


  // Thông tin chi nhánh
  offices = [
    { name: 'TRỤ SỞ HÀ NỘI', address: 'Lô 14 Nguyễn Cảnh Dị, P. Đại Kim, Q. Hoàng Mai, TP. Hà Nội'},
    { name: 'TP. HỒ CHÍ MINH', address: 'Số 9 đường 37, Khu nhà ở ĐôngNam, Khu phố 5, P. Hiệp Bình Phước,TP.Thủ Đức, TP. Hồ Chí Minh'},
    { name: 'HẢI PHÒNG', address: 'Căn BH 01- 47 Khu đô thị Vinhomes Imperia, Đ.Bạch Đằng, P.ThượngLý, Q. Hồng Bàng, TP. Hải Phòng'},
    {
      name: 'ĐÀ NẴNG', 
      address: 'Lô 1 Khu B2-19, KĐT Biệt thự sinh thái, Công Viên Văn Hóa Làng Quê và Quần thể Du lịch sông nước, P. Hòa Quý, Ngũ Hành Sơn, TP. Đà Nẵng'
    },
    { name: 'NGHỆ AN', address: 'Số B5-15,  ngõ 26, Đ. Nguyễn Thái Học, TP. Vinh, Nghệ An'},
    { name: 'HÀ TĨNH', address: 'Số 402, Đ. Trần Phú, X. Thạch Trung, TP. Hà Tĩnh, Hà Tĩnh'},
    { name: 'HUẾ', address: 'Số 01 Cao Thắng, P. An Hòa, TP. Huế, Thừa Thiên Huế'},
  ];

  // Tin tức
  news = [
    {
      img: 'https://bagps.vn/public/media//tuyển_dụng/a.jpg',
      value: '0', 
      title:'GIẢI PHÁP ĐIỀU HÀNH VẬN TẢI',
      shortContent:'Camera giám sát ghi hình trong xe ô tô của BA Group mang đến nhiều lợi ích cho doanh nghiệp vận tải', 
      link: 'https://bagps.vn/'
    },
    {
      img: 'https://bagps.vn/public/media//tuyển_dụng/art_2801.jpg',
      value: '1', 
      title: 'VỀ CHÚNG TÔI', 
      shortContent: 'Thành lập từ năm 2007, sau hơn một thập kỷ không ngừng nỗ lực phát triển, BA GPS đã có trên 600 CBNV, các văn phòng đại diện và hàng trăm đại lý khắp 63 tỉnh thành trên cả nước. Với chiến lược phát triển khẳng định vị thế dẫn đầu tại Việt Nam và dần chinh phục thị trường thế giới, đến nay BA GPS đã có hơn 250.000 thuê bao GSHT trên toàn hệ thống và 91.000 khách hàng thân thiết. Chúng tôi đang nỗ lực hết mình để xây dựng nên thương hiệu BA GPS - một hệ sinh thái kinh doanh cùng có lợi, hợp tác đầy hứng khởi.',
      link: 'https://bagps.vn/gioi-thieu/'
    }, 
    {
      img: 'assets/img/image3.jpg', 
      value: '0', 
      title:'SẢN PHẨM VÀ GIẢI PHÁP',
      shortContent:'Khám phá công nghệ ngành GTVT', 
      link: 'https://bagps.vn/san-pham-va-giai-phap'
    },
    {
      img: 'assets/img/image4.jpg', 
      value: '1', 
      title: 'MẠNG LƯỚI', 
      shortContent:'Hỗ trợ 24/7. BA GPS xây dựng chiến lược phát triển khẳng định vị thế của mình trên thị trường toàn quốc và dần chinh phục thị trường khu vực và quốc tế.',
      link: 'https://bagps.vn/mang-luoi'
    }, {
      img: 'assets/img/image5.jpg', 
      value: '0', 
      title:'TUYỂN DỤNG',
      shortContent:'Chúng tôi luôn chào đón các ứng viên có hoài bão, mong muốn được làm việc trong môi trường quốc tế chuyên nghiệp, năng động và sáng tạo. Nếu bạn có khát vọng đổi thay, đừng ngần ngại tham gia cùng chúng tôi để chinh phục những đỉnh cao mới.', 
      link: '//bagps.vn/tin-tuc-c10'
    },
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public translate: TranslateService,
    private toastr: ToastrService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.screenWidth = window.innerWidth;

    this.rememberMe = localStorage.getItem('isRemember') === '1' ? true : false;
  }

  /** 
   * TODO: Hàm đăng nhập
   * Dùng để thực hiện đăng nhập vào hệ thống khi đã nhập thông tin người dùng
  */
  onSubmit() {
    var user = new Employee();
    user.userName = this.userName ?? '';
    user.password = this.password ?? '';

    this.authenticationService
      .login(user)
      .pipe(first())
      .subscribe(
        {
          next: (data) => {
            if (data === null)
            { 
              this.toastr.warning('Tài khoản hoặc mật khẩu không chính xác');
              return;
            }
              if ( this.rememberMe ) localStorage.setItem('isRemember', '1');
              else localStorage.removeItem('isRemember');
              this.router.navigate([this.returnUrl]);
              this.toastr.success('Thành công');
        },
        error: (err) => {
            if(err.status === 400 ) this.toastr.warning(err.error);
            else this.toastr.error('Tài khoản hoặc mật khẩu không đúng !');
        }}
      );
  }

  // event keypress of input User Name to only allow press text, number 
  keypressUserName(event: KeyboardEvent){
    let value = event.charCode;
    return((value > 64 && value < 91) || (value > 96 && value < 123) || value == 8 || value == 32 || (value >= 48 && value <= 57));
  }

  // Event scroll horizontal for offices
  onWheel(event: WheelEvent): void {
    if(this.screenWidth <= 414) return;
    if (event.deltaY > 0) document.getElementById('office')!.scrollLeft += 40;
    else document.getElementById('office')!.scrollLeft -= 40;
 } 
}
