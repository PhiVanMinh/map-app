import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    // Check active authorization
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;

        let isRemember = localStorage.getItem('isRemember') 

        if (currentUser?.userId && ( isRemember === '1' || this.authenticationService.isUserAuthenticated())) {
            // authorised so return true
            this.authenticationService.authStatusListener.next(true);
            this.authenticationService.getCurrentUserRoles();
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
