import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  isShowLeftPanel = true;
  vehicles = [];
  showConfigVisible!: boolean;
  showSystemStatusForm!: boolean;
    // Tìm kiếm
    listSearchTypes: { dropdownText: string, placeHolder: string, iconUrl: string }[] = [
      {
        dropdownText: 'Tìm theo phương tiện',
        placeHolder: 'Nhập phương tiện',
        iconUrl: ''//'/assets/images/online/left-panel/find-vehicle.png',
      },
      {
        dropdownText: 'Tìm theo địa chỉ',
        placeHolder: 'Nhập tên điểm',
        iconUrl: ''//'/assets/images/online/left-panel/find-landmark.png',
      },
      {
        dropdownText: 'Tìm theo vị trí',
        placeHolder: 'Nhập vị trí',
        iconUrl: ''//'/assets/images/online/left-panel/find-point.png',
      },
    ];
    currentSearchType = 0;
    leftPanelWidth = 300;


  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  getListVehicleInit(){

  }

    // Thay đổi loại tìm kiếm
    changeSearchType(searchType: number) {
      this.currentSearchType = searchType;
      this.cdr.detectChanges();
      // common.delay(50).then(() => {
      //   // Trỏ vào ô nhập
      //   if (searchType < 2) {
      //     this.comboboxSearch?.combobox?.focus();
      //   }
      //   else {
      //     $('.findLatlng').trigger('focus');
      //   }
      // });
    }
}
