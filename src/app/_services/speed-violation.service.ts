import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpeedViolationService {
  
  readonly APIUrl = 'http://10.1.11.115:8001';

  constructor(private http: HttpClient) {}

  // Api get all vehicle by company
  getListVehicle(val: number): Observable<any> {
    return this.http.post<number>(this.APIUrl + `/SpeedViolation/list-vehicle?input=${val}`, val);
  }

  // Api get all vehicle speed violation
  getSpeedViolationVehicles(val: any): Observable<any> {
    return this.http.post<any>(this.APIUrl + '/SpeedViolation/speed-violation', val);
  }

  exportExcel(val: any) {
    return this.http.post(this.APIUrl + '/SpeedViolation/report_speed_violation', val, {responseType: 'arraybuffer'});
  }

}
