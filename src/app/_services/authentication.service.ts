import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../_models/employee';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  readonly APIUrl = 'http://10.1.11.115:8001';

  private currentUserSubject: BehaviorSubject<Employee>;

   authStatusListener = new Subject<boolean>();  

   roles: string[] = [];

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
    ) {
    // Get current user
    this.currentUserSubject = new BehaviorSubject<Employee>(
        JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
  }

  public get currentUserValue(): Employee {
    return this.currentUserSubject.value;
  }

  public get currentUserRoles(): string[] {
    return this.roles;
  }

  // Check expired token
  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
 
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  login(user: Employee) {
    return this.http.post<any>(this.APIUrl + '/Auth/login', user).pipe(
      map((data) => {
        // login successful if there's a jwt token in the response
        if (data.user && data.user?.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          localStorage.setItem('token', JSON.stringify(data.jwt_token));
          this.currentUserSubject.next(data.user);
          this.authStatusListener.next(true);  
        } else {
          console.log('failed');
        }
        return data.user;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    this.authStatusListener.next(false);  
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(new Employee());
  }

  // Check user login log or log out to notify other component
  getAuthStatusListener() {  
    return this.authStatusListener.asObservable();  
  } 
  
  // get roles of current user
  getCurrentUserRoles(){
    const token = localStorage.getItem("token");
    let decodedToken = this.jwtHelper.decodeToken(token ?? '');
    this.roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }
}
