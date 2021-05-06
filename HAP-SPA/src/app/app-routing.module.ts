import { VillageComponent } from './Lookup/village/village.component';
import { DistrictComponent } from './Lookup/district/district.component';
import { ProvinceComponent } from './Lookup/province/province.component';
import { OrganizationComponent } from './Lookup/organization/organization.component';
import { MainlayoutComponent } from './mainlayout/mainlayout.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { InitialLookupsResolverService } from './_resolvers/initialLookupsResolver.service';
import { GeneralLookupsComponent } from './Lookup/general-Lookups/general-lookups.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: MainlayoutComponent, canActivate: [AuthGuard],
  children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent
    // ,
    // resolve: {
    //   initialLookups: InitialLookupsResolverService
    //         }
     }
    ,
    {path: 'GeneralLookups', component: GeneralLookupsComponent},
    {path: 'Organization', component: OrganizationComponent},
    {path: 'Province', component: ProvinceComponent},
    {path: 'District', component: DistrictComponent},
    {path: 'Village', component: VillageComponent},
    {path: 'userManagement',  data: { roles: ['Admin']}, canActivate: [AuthGuard], component: UserManagementComponent},
    {path: '**' ,component: PageNotFoundComponent}
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {  
}
