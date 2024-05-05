import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

export default class Validation {
  static match(controlName: string, checkControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const checkControl = formGroup.controls[checkControlName];

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        checkControl?.setErrors({ matching: true });
        return { matching: true };
      } else {
        checkControl?.setErrors(null);
        return null;
      }
    };
  }
  static dateValidator(controlName: any) {
    return (formGroup: FormGroup) => {
      if(formGroup.controls[controlName]?.value) {
        const control = formGroup.controls[controlName];
        const date = moment( formGroup.controls[controlName].value);;
        const today = moment();
  
        if (!date.isBefore(today)) {
            control.setErrors({ invalidDate: true });
            return { invalidDate: true }
          }
          if (!date.isBefore(today.add(-18,'years')))
          {
            control.setErrors({ invalidDateMoreThan18: true });
            return { invalidDateMoreThan18 : true}
          }
      }
      return null
    };
  }
}