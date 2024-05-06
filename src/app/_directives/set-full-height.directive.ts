import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[setFullHeight]'
})
export class SetFullHeightDirective implements OnInit, OnDestroy {
  @Input() setFullHeight: boolean | '' = true;
  @Input() fullMinHeight = false;
  @Input() fullMaxHeight = false;
  @Input() autoScroll?: boolean;
  @Input() scrollBarThin = true;
  /** Element để tính chiều cao ban đầu. Mặc định: `document` */
  @Input() rootElement!: HTMLElement;
  @Input() offsetElements?: Array<string | HTMLElement>;
  /** Tự động tính toán dựa trên các phần tử anh/chị em */
  @Input() autoCalculatorSiblingHeight?: boolean;
  @Input() offsetHeight?: number;
  private resizeObserver!: ResizeObserver;
  /** Danh sách phần tử DOM cần theo dõi thay đổi kích thước để đặt lại chiều cao */
  @Input() elementHandleResize!: HTMLElement | HTMLElement[];
  /** Chiều cao sau khi tính toán xong */
  @Input() height!: number;
  @Output() heightChange = new EventEmitter<number>();

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit() {
    this.resizeObserver = new ResizeObserver(() => this.setHeight());
    this.resizeObserver.observe(document.documentElement);

    if (this.elementHandleResize) {
      const elements = Array.isArray(this.elementHandleResize) ? this.elementHandleResize : [this.elementHandleResize];
      for (const element of elements) {
        this.resizeObserver.observe(element);
      }
    }

    setTimeout(() => this.setHeight(), 100);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  setHeight() {
    if (typeof this.setFullHeight === 'string' && !this.setFullHeight) {
      this.setFullHeight = true;
    }

    if (typeof this.fullMinHeight === 'string' && !this.fullMinHeight) {
      this.fullMinHeight = true;
    }

    if (typeof this.fullMaxHeight === 'string' && !this.fullMaxHeight) {
      this.fullMaxHeight = true;
    }

    if (typeof this.autoScroll === 'string' && !this.autoScroll) {
      this.autoScroll = true;
    }

    if (this.setFullHeight || this.fullMinHeight || this.fullMaxHeight) {
      const contentHeight = this.rootElement ? this.rootElement.offsetHeight : document.documentElement.offsetHeight;

      const parent = this.elementRef.nativeElement.parentElement;

      let siblingHeight = 0;
      let offsetElements = Array<HTMLElement | string>();

      if (this.autoCalculatorSiblingHeight && parent) {
        offsetElements = Array.from(parent.children).filter(x => x !== this.elementRef.nativeElement) as HTMLElement[];
      }

      if (this.offsetElements?.length) {
        offsetElements = offsetElements.concat(this.offsetElements);
      }

      if (offsetElements.length) {
        offsetElements.forEach(item => {
          if (item) {
            if (item instanceof HTMLElement) {
              siblingHeight += item.offsetHeight;
            }
            else if (typeof item === 'string') {
              const element = (this.rootElement ?? document).querySelector<HTMLElement>(item);
              if (element) {
                siblingHeight += element.offsetHeight;
              }
            }
          }
        });
      }

      const height = (contentHeight - siblingHeight - (this.offsetHeight ?? 0));

      if (this.setFullHeight) {
        this.elementRef.nativeElement.style.height = this.elementRef.nativeElement.style.maxHeight = height + 'px';
      }

      if (this.fullMinHeight) {
        this.elementRef.nativeElement.style.minHeight = height + 'px';
      }

      if (this.fullMaxHeight) {
        this.elementRef.nativeElement.style.maxHeight = height + 'px';
      }

      if (this.autoScroll) {
        this.elementRef.nativeElement.style.overflowY = 'auto';
        if (this.scrollBarThin) {
          this.elementRef.nativeElement.classList.add('scrollbar-thin');
        }
      }

      this.height = height;
      this.heightChange.emit(height);
    }
  }
}
