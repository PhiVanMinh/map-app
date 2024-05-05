import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../_models/employee';

@Injectable({ providedIn: 'root' })
export class UserService {

  readonly APIUrl = 'http://10.1.11.115:8001';

  constructor(private http: HttpClient) {}

  // Api get all users
  getEmployees(val: any): Observable<any> {
    return this.http.post<any>(this.APIUrl + '/Users/employees', val);
  }

  // Api create or update user
  createOrUpdateEmployee(val: Employee) {
    return this.http.post<any>(this.APIUrl + '/Users/createOrEdit-employees', val);
  }

  // Api delete users
  deleteEmployee(val: any): Observable<any> {
    return this.http.post<any>(this.APIUrl + '/Users/delete-employees', val);
  }

  exportExcel(val: any) {
    return this.http.post(this.APIUrl + '/Users/export-excel', val, {responseType: 'arraybuffer'});
  }
}
