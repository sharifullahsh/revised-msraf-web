import { EditOrganizationDialogComponent } from './Lookup/dialog/edit-organization-dialog/edit-organization-dialog.component';
import { AdminChangePassDialogComponent } from './admin/dialog/admin-change-pass-dialog/admin-change-pass-dialog.component';
import { EditUserDialogComponent } from './admin/dialog/edit-user-dialog/edit-user-dialog.component';
import { LookupService } from 'src/app/_services/lookup.service';
import { AdminService } from './_services/admin.service';
import { AuthGuard } from './_guards/auth.guard';
import { HttpInterceptorService } from './_services/http-interceptor.service';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './_services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './shared/modules/angular-material.module';
import { SharedModule } from './shared/modules/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { MainlayoutComponent } from './mainlayout/mainlayout.component';
import { JwtModule } from '@auth0/angular-jwt';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { HasRoleDirective } from './_directives/has-role.directive';

import { DeleteDialogComponent } from './shared/dialog/delete/delete-dialog.component';
import { AddUserDialogComponent } from './admin/dialog/add-user-dialog/add-user-dialog.component';
import { UserChangePassDialogComponent } from './shared/dialog/user-change-pass-dialog/user-change-pass-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HasRightsDirective } from './_directives/has-rights.directive';
import { AddRoleDialogComponent } from './admin/dialog/add-role-dialog/add-role-dialog.component';
import { EditRoleDialogComponent } from './admin/dialog/edit-role-dialog/edit-role-dialog.component';
import { GeneralLookupsComponent } from './Lookup/general-Lookups/general-lookups.component';
import { AddLookupDialogComponent } from './Lookup/dialog/add-lookup-dialog/add-lookup-dialog.component';
import { EditLookupDialogComponent } from './Lookup/dialog/edit-lookup-dialog/edit-lookup-dialog.component';
import { ProvinceComponent } from './Lookup/province/province.component';
import { DistrictComponent } from './Lookup/district/district.component';
import { VillageComponent } from './Lookup/village/village.component';
import { OrganizationComponent } from './Lookup/organization/organization.component';
import { AddOrganizationDialogComponent } from './Lookup/dialog/add-organization-dialog/add-organization-dialog.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    LoginComponent,
    MainlayoutComponent,
    UserManagementComponent,
    HasRoleDirective,
    HasRightsDirective,
    DeleteDialogComponent,
    AddUserDialogComponent,
    AddRoleDialogComponent,
    EditRoleDialogComponent,
    EditUserDialogComponent,
    AdminChangePassDialogComponent,
    UserChangePassDialogComponent,
    GeneralLookupsComponent,
    AddLookupDialogComponent,
    EditLookupDialogComponent,
    ProvinceComponent,
    DistrictComponent,
    VillageComponent,
    OrganizationComponent,
    AddOrganizationDialogComponent,
    EditOrganizationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularMaterialModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        //whitelistedDomains: ['afghanresponse.iom.int'],
        whitelistedDomains:['localhost:54749'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

  ],
  providers: [AuthService, AdminService, AuthGuard,
     HttpInterceptorService, LookupService,],
  entryComponents: [DeleteDialogComponent, AddUserDialogComponent,AddRoleDialogComponent,EditRoleDialogComponent, EditUserDialogComponent,
  AdminChangePassDialogComponent, UserChangePassDialogComponent,
AddLookupDialogComponent, EditLookupDialogComponent,
AddOrganizationDialogComponent,EditOrganizationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
