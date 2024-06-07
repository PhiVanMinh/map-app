import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// import { ArrayHelper, ElementHelper } from '@shared/helpers';
import { Subscription, filter } from 'rxjs';

/**
* Popup dùng chung cho phép truyền content từ bên ngoài
* @Author Trần Trinh
* @Created 17/05/2021
* @ModifiedBy
* @ModifiedDate
* @ModifiedDesc
*/
@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss']
})
export class CustomPopupComponent implements OnInit, OnDestroy, OnChanges {
  /** Cho phép hiển thị hay không */
  @Input() isShow = false;
  @Output() isShowChange = new EventEmitter<boolean>();
  /** Hiển thị header. Mặc đinh: `true` */
  @Input() showHeader = true;
  /** Có cho phép kéo/di chuyển popup hay không. Mặc đinh: `true` */
  @Input() allowDrag = true;
  /** Nút ghim */
  @Input() showPinButton = true;
  /** Nút phản hồi */
  @Input() showFeedbackButton = true;
  /** Url icon tiêu đề */
  @Input() titleIcon: string | undefined;
  /** Key Tiêu đề popup*/
  @Input() title: string | undefined ;
  /** Margin tối thiểu trên và dưới. Đơn vị px */
  @Input() minMargin = 10;
  /** Popup body padding */
  @Input() padding = '10px';
  /** Chiều rộng. Vd:auto, 60% hoặc 600px */
  @Input() width: string | undefined;
  /** Chiều rộng tối thiểu. Vd: 80% hoặc 300px */
  @Input() minWidth: string | undefined;
  /** Chiều rộng tối đa. Vd: 100% hoặc 900px */
  @Input() maxWidth: string | undefined;
  /** Chiều cao. Vd: 80% hoặc 300px */
  @Input() height: string | undefined;
  /** Chiều cao tối thiểu. Vd: 80% hoặc 100px */
  @Input() minHeight: string | undefined;
  /** Chiều cao tối đa. Vd: 100% hoặc 900px */
  @Input() maxHeight: string | undefined;
  /** Vị trí hiển thị theo chiều ngang. Mặc định: `center` */
  @Input() horizontalPosition: 'center' | 'left' | 'right' = 'center';

  /** Cho phép popup cách lề trái 1 khoảng tùy ý */
  @Input() leftStartCustom: number = 0;

  /** Vị trí hiển thị theo chiều dọc*/
  @Input() verticalPosition: 'top' | 'center' | 'bottom' | 'menu' | undefined;
  /** Hiển thị nền đen hay không. Mặc đinh: `true` */
  @Input() backdrop = true;
  /** Chèn thêm button/HTML trước nút ghim */
  @Input() customButtom!: TemplateRef<any>;
  /** Giá trị Top hiển thị lần đầu tiên. Vd: 10% hoặc 10px */
  @Input() initTop: string | undefined;
  /** Giá trị Left hiển thị lần đầu tiên. Vd: 10% hoặc 10px */
  @Input() initLeft: string | undefined;

  @Input() classPopupBody: string | undefined;

  @Input() isLoading: boolean | undefined;
  @Input() hideScroll: boolean | undefined;
  /** Tự động đóng popup khi thay đổi route, chuyển trang */
  @Input() closeOnRouteChange = true;
  /** Emit ra trạng thái Pin hiện tại */
  @Output() onPinChanged = new EventEmitter<boolean>();
  /** Emit true nếu đóng popup */
  @Output() onClose = new EventEmitter<boolean>();
  @Output() onShowed = new EventEmitter<boolean>();

  /** Chiều cao tối đa của phần nội dung */
  contentMaxHeight: number | undefined;
  popupContentResizeHandler: ResizeObserver | undefined;

  popupElement: HTMLElement | null | undefined;
  zIndex!: number;
  subRoute!: Subscription;

  // LanguageKeys = LanguageKeys;
  isPin!: boolean;
  topStart = 0;
  leftStart = 0;
  isMouseClick!: boolean;
  protected isDragged?: boolean;

  constructor(private elementRef: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    if (this.closeOnRouteChange) {
      this.subRoute = this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.closePopup();
        });
    }
  }

  ngOnDestroy() {
    // clearTimeout(this.autoPositionTimer);
    this.popupContentResizeHandler?.disconnect();
    this.subRoute?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'isShow') {
        if (!this.isShow) {
          this.ngOnDestroy();
        }
        else {
          this.cdr.detectChanges();
            // Lấy đối tượng popup
            this.popupElement = this.elementRef.nativeElement.querySelector<HTMLElement>('.popup');
            if (this.popupElement) {
              // Tạm ẩn
              this.popupElement.classList.remove('popup-show');
              // Gán lại zIndex
              this.zIndex = this.getLatestZIndex() + 2;
              // Hiển thị
              this.autoPosition();
              this.popupElement.classList.add('popup-show');
              // Theo dõi thay đổi kích thước
              const popupBody = this.popupElement.lastElementChild as HTMLElement;
              if (popupBody) {
                const contentElement = popupBody.firstElementChild as HTMLElement;
                if (contentElement) {
                  this.popupContentResizeHandler = new ResizeObserver(() => {
                    this.autoPositionDelay();
                  });
                  this.popupContentResizeHandler.observe(contentElement);
                }
              }

              this.onShowed.emit(true);
            }
        }
        break;
      }
    }
  }

  getLatestZIndex(listPopup?: HTMLElement[]) {
    let zIndex = 1000;
    listPopup = listPopup ?? Array.from(document.querySelectorAll<HTMLElement>('.custom-popup .popup'));
    if (listPopup?.length >= 1) {
      // Lây danh sách zIndex và sắp xếp giảm dần
      let listPopupZindex = listPopup.filter(x => x.style.zIndex).map(x => Number.parseInt(x.style.zIndex));
      if (listPopupZindex.length > 0) {
        // listPopupZindex = ArrayHelper.sort(listPopupZindex, null, true);
        zIndex = listPopupZindex[0];
      }
    }

    return zIndex;
  }

  /** Tự động điều chỉnh vị trí, kích thước popup */
  private autoPosition() {
    if (this.popupElement) {
      // Chỉnh max width
      this.popupElement.style.maxWidth = this.maxWidth ?? (document.documentElement.offsetWidth - this.minMargin * 2) + 'px';
      // Chỉnh max height
      let popupMaxHeight = 0;
      if (this.maxHeight) {
        if (this.maxHeight.endsWith('%') || this.maxHeight.endsWith('vh')) {
          popupMaxHeight = Number.parseInt(this.maxHeight) * document.documentElement.offsetHeight / 100;
        }
        else {
          popupMaxHeight = Number.parseInt(this.maxHeight);
        }

        if (popupMaxHeight > document.documentElement.offsetHeight - this.minMargin * 2) {
          popupMaxHeight = document.documentElement.offsetHeight - this.minMargin * 2;
        }
      }
      else {
        popupMaxHeight = document.documentElement.offsetHeight - this.minMargin * 2;
      }
      this.popupElement.style.maxHeight = popupMaxHeight + 'px';

      const popupHeader = this.showHeader ? this.popupElement.firstElementChild as HTMLElement : null;
      const popupBody = this.popupElement.lastElementChild as HTMLElement;
      if (popupBody) {
        const popupBodyMaxHeight = popupMaxHeight - (popupHeader?.offsetHeight ?? 0);
        popupBody.style.maxHeight = popupBodyMaxHeight + 'px';
        const popupBodyPaddingTop = 100 //ElementHelper.getStyleValue<number>(popupBody, 'padding-top', true, 0);
        const popupBodyPaddingBottom = 100 //ElementHelper.getStyleValue<number>(popupBody, 'padding-bottom', true, 0);
        this.contentMaxHeight = popupBodyMaxHeight - popupBodyPaddingTop - popupBodyPaddingBottom;
      }

      // Chỉnh Top - Bottom
      let top: number;

      if (!this.isDragged) {
        if (this.initTop) {
          if (this.initTop.endsWith('%') || this.initTop.endsWith('vh')) {
            top = Number.parseInt(this.initTop) * document.documentElement.offsetHeight / 100;
          }
          else {
            top = Number.parseInt(this.initTop);
          }

          if (top < 0) {
            top = 0;
          }
          else if (top > document.documentElement.offsetHeight - this.popupElement.offsetHeight) {
            top = document.documentElement.offsetHeight - this.popupElement.offsetHeight;
          }
        }
        else if (!this.verticalPosition || this.verticalPosition === 'menu') {
          top = 100 + (this.verticalPosition ? 0 : this.minMargin); // common.headerElement.offsetHeight
          if (top > document.documentElement.offsetHeight - this.popupElement.offsetHeight) {
            top = (document.documentElement.offsetHeight - this.popupElement.offsetHeight) / 2;
          }
        }
        else if (this.verticalPosition === 'center') {
          top = (document.documentElement.offsetHeight - this.popupElement.offsetHeight) / 2;
        }
        else if (this.verticalPosition === 'top') {
          top = 0;
        }
        else if (this.verticalPosition === 'bottom') {
          top = document.documentElement.offsetHeight - this.popupElement.offsetHeight;
        }
      }
      else {
        const currentTop = Number.parseFloat(this.popupElement.style.top);
        if (currentTop < 0) {
          top = 0;
        }
        else if (currentTop > document.documentElement.offsetHeight - this.popupElement.offsetHeight) {
          top = document.documentElement.offsetHeight - this.popupElement.offsetHeight;
        }
      }

      // if (top != null) {
      //   this.popupElement.style.top = top + 'px';
      // }

      // Chỉnh Left - Right
      let left: number;

      if (!this.isDragged) {
        if (this.initLeft) {
          if (this.initLeft.endsWith('%') || this.initLeft.endsWith('vw')) {
            left = Number.parseInt(this.initLeft) * document.documentElement.offsetWidth / 100;
          }
          else {
            left = Number.parseInt(this.initLeft);
          }

          if (left < 0) {
            left = 0;
          }
          else if (left > document.documentElement.offsetWidth - this.popupElement.offsetWidth) {
            left = document.documentElement.offsetWidth - this.popupElement.offsetWidth;
          }
        }
        else if (this.horizontalPosition === 'center') {
          left = (document.documentElement.offsetWidth - this.popupElement.offsetWidth) / 2;
        }
        else if (this.horizontalPosition === 'left') {
          left = 0;
        }
        else if (this.horizontalPosition === 'right') {
          left = document.documentElement.offsetWidth - this.popupElement.offsetWidth;
        }

      }
      else {
        const currentLeft = Number.parseFloat(this.popupElement.style.left);
        if (currentLeft < 0) {
          left = 0;
        }
        else if (currentLeft > document.documentElement.offsetWidth - this.popupElement.offsetWidth) {
          left = document.documentElement.offsetWidth - this.popupElement.offsetWidth;
        }
      }

      // if (left != null) {
      //   this.popupElement.style.left = left + 'px';
      // }

      // Tự chuyển sang chế độ cuộn
      if (popupBody) {
        const contentElement = popupBody.firstElementChild as HTMLElement;
        if (contentElement) {
          const popupBodyPaddingTop = 100; //ElementHelper.getStyleValue<number>(popupBody, 'padding-top', true, 0);
          const popupBodyPaddingBottom = 100; // ElementHelper.getStyleValue<number>(popupBody, 'padding-bottom', true, 0);
          const popupBodyPaddingLeft = 100; // ElementHelper.getStyleValue<number>(popupBody, 'padding-left', true, 0);
          const popupBodyPaddingRight = 100; // ElementHelper.getStyleValue<number>(popupBody, 'padding-right', true, 0);
          if ((contentElement.offsetHeight + popupBodyPaddingTop + popupBodyPaddingBottom) > popupBody.offsetHeight || (contentElement.offsetWidth + popupBodyPaddingLeft + popupBodyPaddingRight) > popupBody.offsetWidth) {
            popupBody.style.overflow = this.hideScroll ? 'hidden' : 'auto';
          }
          else {
            popupBody.style.overflow = '';
          }
        }
      }
    }
  }

  // private autoPositionTimer!: NodeJS.Timeout;
  /** Tự động điều chỉnh vị trí, kích thước popup */
  private autoPositionDelay() {
    // clearTimeout(this.autoPositionTimer);
    // this.autoPositionTimer = setTimeout(() => {
    //   this.autoPosition();
    // }, 100);
  }

  /** Pin/Unpin popup */
  togglePinPopup() {
    this.isPin = !this.isPin;
    this.onPinChanged.emit(this.isPin);
  }

  /** Khi nhấn nút đóng popup (hủy element) */
  closePopup() {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.onClose.emit(true);
    this.cdr.detectChanges();
  }

  feedBackClick() {
    // common.notificationInfo(LanguageKeys.CommonKeys.FunctionNotImplement);
  }

  /** Sự kiện resize window */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.autoPositionDelay();
  }

  swapPopup(e: MouseEvent) {
    e.stopPropagation();

    const hasAnyBackdrop = this.backdrop || document.querySelector('.popup-backdrop') != null;
    if (!hasAnyBackdrop) {
      // Có nhiều popup thì thực hiện swap
      const listPopup = Array.from(document.querySelectorAll<HTMLElement>('.custom-popup .popup'));
      if (listPopup?.length > 1) {
        // Chuyển đổi zIndex với đối tượng cao nhất
        const latestZindex = this.getLatestZIndex(listPopup).toString();
        if (this.popupElement?.style.zIndex !== latestZindex && this.popupElement != null) {
          // Lấy popup có Zindex cao nhất
          const latestPopup = listPopup.find(x => x.style.zIndex == latestZindex);
          if (latestPopup) {
            latestPopup.style.zIndex = this.popupElement.style.zIndex;
            this.popupElement.style.zIndex = latestZindex;
          }
        }
      }
    }
  }

  /** Sự kiện nhấn giữ vào header popup */
  onHeaderHold(event: MouseEvent) {
    event.preventDefault();
    // prevents right click drag, remove his if you don't want it
    if (event.button === 2) { return; }
    this.isMouseClick = true;
    if ( this.popupElement != null && this.popupElement.style.top === '') {
      this.popupElement.style.top = this.popupElement.offsetTop + 'px';
    }
    if (this.popupElement != null && this.popupElement.style.left === '') {
      this.popupElement.style.left = this.popupElement.offsetLeft + 'px';
    }
    this.topStart = event.clientY - Number.parseFloat(this.popupElement?.style.top ?? '');
    this.leftStart = event.clientX - Number.parseFloat(this.popupElement?.style.left ?? '');
  }

  /** Sự kiện khi thả chuột khỏi document */
  @HostListener('document:mouseup')
  onMouseUp() {
    this.isMouseClick = false;
  }

  /** Sự kiện khi con trỏ chuột di chuyển trên document */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMouseClick && this.allowDrag && !this.isPin && this.showHeader) {
      event.preventDefault();
      let top = event.clientY - this.topStart;
      let left = event.clientX - this.leftStart;
      // Giới hạn top
      const popupHeader = this.popupElement?.querySelector<HTMLElement>('.popup-header');
      if (top < 0) {
        top = 0;
      }
      else if (top > document.documentElement.offsetHeight - (popupHeader?.offsetHeight ?? 0)) {
        top = document.documentElement.offsetHeight - (popupHeader?.offsetHeight ?? 0);
      }
      // Giới hạn left
      if (left < 0) {
        left = 0;
      }
      else if (left > document.documentElement.offsetWidth - (popupHeader?.offsetWidth ?? 0)) {
        left = document.documentElement.offsetWidth - (popupHeader?.offsetWidth ?? 0);
      }

      if(this.popupElement != null) {
      this.popupElement.style.top = top + 'px';
      this.popupElement.style.left = left + 'px';
      }

      this.isDragged = true;
    }
  }

  /**  Khi người dùng chạm (cảm ứng) vào document */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    event.stopPropagation();

    this.isMouseClick = true;
    this.topStart = event.changedTouches[0].clientY - Number.parseFloat(this.popupElement?.style.top ?? '');
    this.leftStart = event.changedTouches[0].clientX - Number.parseFloat(this.popupElement?.style.left ?? '');
  }

  /**  Khi người dùng bỏ chạm (cảm ứng) khỏi document */
  @HostListener('document:touchend')
  onTouchEnd() {
    this.isMouseClick = false;
  }

  /**  Khi người dùng chạm và di chuyển document */
  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.stopPropagation();

    if (this.popupElement != null && this.isMouseClick && this.allowDrag && !this.isPin) {
      this.popupElement.style.top = event.changedTouches[0].clientY - this.topStart + 'px';
      this.popupElement.style.left = event.changedTouches[0].clientX - this.leftStart + 'px';

      this.isDragged = true;
    }
  }
}
