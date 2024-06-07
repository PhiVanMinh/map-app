import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatepickerComponent } from './_components/share/input-types/datepicker/datepicker.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { defineLocale, viLocale,  } from 'ngx-bootstrap/chronos';
import { ConfirmModalComponent } from './_components/share/modal/confirm-modal/confirm-modal.component';
import { SpinnerComponent } from './_components/share/spinner/spinner/spinner.component';
import { LoadingInterceptor } from './_helpers/loading.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { PermissionPipe } from './_components/_pipe/permission.pipe';
import { ValidateBirthdayDirective } from './_directives/validate-birthday.directive';
import { MatchPasswordDirective } from './_directives/match-password.directive';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CreateOrEditEmployeeComponent } from './pages/employee-management/create-or-edit-employee/create-or-edit-employee.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { LoginComponent } from './pages/login/login.component';
import { ReportSpeedViolationComponent } from './pages/report-speed-violation/report-speed-violation.component';
import { routing } from './routes';
import { OnlineComponent } from './pages/online/online.component';
import { RouteComponent } from './pages/route/route.component';
import { LeftPanelComponent } from './pages/left-panel/left-panel.component';
import { SetFullHeightDirective } from './_directives/set-full-height.directive';
import { LandmarkComponent } from './pages/landmark/landmark.component';
import { VirtualTreeComponent } from './_components/share/virtual-tree/virtual-tree.component';
import { TreeModule } from '@ali-hm/angular-tree-component';
import { CustomPopupComponent } from './_components/share/custom-popup/custom-popup.component';

defineLocale('vi', viLocale);

export function tokenGetter() {
  return localStorage.getItem("token");
}

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateOrEditEmployeeComponent,
    EmployeeManagementComponent,
    DatepickerComponent,
    ConfirmModalComponent,
    SpinnerComponent,
    PermissionPipe,
    ValidateBirthdayDirective,
    MatchPasswordDirective,

    ReportSpeedViolationComponent,
    OnlineComponent,
    RouteComponent,
    LeftPanelComponent,
    LandmarkComponent,
    VirtualTreeComponent,
    CustomPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    ReactiveFormsModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    routing,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      timeOut: 3000,
      // easing: "ease-in"

    }),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:59686"],
        disallowedRoutes: []
      }
    }),
    // NgxMaskModule.forRoot(maskConfig),
    NgMultiSelectDropDownModule.forRoot(),
    TreeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private bsLocaleService: BsLocaleService
   ) {
    this.bsLocaleService.use('vi');
   }
}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');


}
