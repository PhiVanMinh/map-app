
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { ReportSpeedViolationComponent } from './pages/report-speed-violation/report-speed-violation.component';

const appRoutes: Routes = [
  { path: 'employee', component: EmployeeManagementComponent, canActivate: [AuthGuard] }, 
  { path: 'login', component: LoginComponent },
  { path: '', component: ReportSpeedViolationComponent, canActivate: [AuthGuard] },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

export const routing = RouterModule.forRoot(appRoutes);
