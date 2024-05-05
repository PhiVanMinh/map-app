import { Pipe, PipeTransform } from '@angular/core';
/*
    Check permission
*/
@Pipe({name: 'permission'})
export class PermissionPipe implements PipeTransform {
  transform(value: string, array: string[] ): boolean {
    return array?.includes(value) ?? false;
  }
}