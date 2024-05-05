import { Directive, Input } from '@angular/core';
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import Validation from '../_utils/validation';


@Directive({
  selector: '[validateBirthday]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidateBirthdayDirective, multi: true }]
})
export class ValidateBirthdayDirective implements Validator {
  @Input('validateBirthday') validateBirthday: string[] = [];

  validate(formGroup: FormGroup): ValidationErrors | null {
    return Validation.dateValidator(this.validateBirthday[0])(formGroup);
  }
}