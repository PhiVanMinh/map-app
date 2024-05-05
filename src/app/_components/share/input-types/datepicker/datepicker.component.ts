import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor, OnInit {

  @ViewChild('datepicker', { static: false }) datepicker!: BsDatepickerDirective;
  @Input() defaultValue: any;
  @Input() className!: string;
  @Input() addOnMinWidth!: string;
  @Input() text!: string;
  @Input() isRequired!: boolean;
  @Input() placement!: string;
  @Input() disable: any;
  @Input() ignoredCalender: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() typeMonth: any;
  @Input() showMonth!: boolean;
  @Input() showDeleteBtn!: boolean;
  @Input() dateInputFormat: string = 'DD/MM/YYYY';
  private onChange!: Function;
  @Input() isDisabled: boolean = false;
  @Input() value: any;
  @Input() validate!: any;
  inputValue!: Date;
	hour: string = new Date().getHours().toString();
	minute: string = new Date().getMinutes().toString();


  constructor(private _eref: ElementRef) { }

  ngOnInit() { }

  openDatepicker() {
    this.datepicker.toggle();
  }

  onValueChange(val?: any) {
    if (val && val != null) {
      var offset = new Date().getTimezoneOffset();

      // set time to 0
      val?.setHours(0);
      val.setMinutes(0);
      val?.setSeconds(0);

      // add time zone 
      val?.setTime(val.getTime() - (offset / 60) * 60 * 60 * 1000);

      this.value = val;
      if (typeof this.onChange === 'function') {
        this.onChange(this.value);
      }
    } 
    else if (typeof this.onChange === 'function') {
      this.onChange(undefined)
    }
  }

  writeValue(val: any) {
    this.value = val ?? this.defaultValue;

    if (!val && !this.defaultValue)
      return this.datepicker?.bsValueChange.emit(undefined);
    if (this.value instanceof Date) this.datepicker?.bsValueChange.emit(this.value);
    else if (this.value instanceof moment) {
      this.datepicker?.bsValueChange.emit(val?.toDate());
      this.value = val?.toDate();
    }
    else {
      this.value = moment(val);
      this.datepicker?.bsValueChange.emit(this.value?.toDate());
    }
  }


  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) { }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled || false;
  }

  onOpenCalendar(container: { monthSelectHandler: (event: any) => void; _store: { dispatch: (arg0: any) => void; }; _actions: { select: (arg0: any) => any; }; setViewMode: (arg0: string) => void; }) {
    if (!this.typeMonth) {
      return;
    }
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  keydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (!this.inputValue || this.inputValue.toString() === 'Invalid Date') {
				this.inputValue = new Date();
				this.hour = new Date().getHours().toString();
				this.minute = new Date().getMinutes().toString();
			}
			this.value = this.inputValue;
		}
		if (e.key === 'Control' || e.key === 'Alt') {
			this.datepicker.bsValueChange.emit(this.inputValue ?? this.value);
		}
	}

  keypress(event: KeyboardEvent){
    let value = event.charCode;
    return(value == 8 || (value >= 47 && value <= 57));
  }
}

