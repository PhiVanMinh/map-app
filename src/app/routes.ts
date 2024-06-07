
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { ReportSpeedViolationComponent } from './pages/report-speed-violation/report-speed-violation.component';
import { OnlineComponent } from './pages/online/online.component';
import { RouteComponent } from './pages/route/route.component';
import { LandmarkComponent } from './pages/landmark/landmark.component';

const appRoutes: Routes = [
  // { path: 'employee', component: EmployeeManagementComponent, canActivate: [AuthGuard] },
  // { path: 'login', component: LoginComponent },
  // { path: '', component: ReportSpeedViolationComponent, canActivate: [AuthGuard] },

  { path: 'route', component: RouteComponent },
  { path: 'online', component: OnlineComponent },
  { path: 'landmark', component: LandmarkComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

export const routing = RouterModule.forRoot(appRoutes);
