import { OrganizationSearchCriteria } from './../../models/Search';
import { OrganizationService } from './../../_services/organization.service';
import { LookupValueSelectList } from './../../models/Lookup';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { LookupType, LookupValue } from 'src/app/models/Lookup';
import { DeleteDialogComponent } from 'src/app/shared/dialog/delete/delete-dialog.component';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { AddLookupDialogComponent } from '../dialog/add-lookup-dialog/add-lookup-dialog.component';
import { EditLookupDialogComponent } from '../dialog/edit-lookup-dialog/edit-lookup-dialog.component';
import { FormBuilder } from '@angular/forms';
import { OrganizationSearchedList, OrganizationSearchResponse } from 'src/app/models/SearchResponse';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements AfterViewInit, OnInit {
  organizationSearchCriteria:OrganizationSearchCriteria;
  pageIndex = 0;
  length = 100;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatTable) table: MatTable<OrganizationSearchedList>;
 dataSource: MatTableDataSource<OrganizationSearchedList> ;

 searchKey: string;
 /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
 displayedColumns = ['#', 'organizationCode', 'organizationName', 'organizationCategory', 'isActive','actions'];


constructor(
            private alertifyService: AlertifyService,
            public organizationService: OrganizationService,
            public dialog: MatDialog,
            private fb: FormBuilder,
            public lookupService: LookupService){
}
      public ?: string
searchForm = this.fb.group({
  organizationCategory: [null],
  organizationName: [null]
});
 ngOnInit() {
   this.organizationSearchCriteria =  new OrganizationSearchCriteria();
   console.log("lookuptypes are "+ JSON.stringify(this.organizationService.orgCategoryList));
   //this.lookupService.getAvailableRoles();
   this.lookupService.getLookupValues("ORGTYP").subscribe((data: LookupValue[])=>{
    this.organizationService.orgCategoryList = data.map(l=> {
      let orgType:LookupValueSelectList={};
      orgType.lookupName = l.enName;
      orgType.valueCode = l.valueCode;
      return orgType;
    });
    //assign the lookupTypes for use in dialogs
  });
   this.getOrganizations();
 }
getOrganizations() {
  this.organizationSearchCriteria.pageIndex = this.pageIndex;
    this.organizationSearchCriteria.pageSize = this.pageSize;
    this.organizationSearchCriteria =  new OrganizationSearchCriteria();
    if(this.searchForm.get('organizationCategory').value){
      this.organizationSearchCriteria.organizationCategory = this.searchForm.get('organizationCategory').value;
    }
    if(this.searchForm.get('organizationName').value){
      this.organizationSearchCriteria.organizationName = this.searchForm.get('organizationName').value.trim();
    }
 
    this.organizationSearchCriteria.pageSize = this.pageSize;
    this.organizationSearchCriteria.pageIndex = this.pageIndex;
    this.organizationService.getOrganizations(this.organizationSearchCriteria).subscribe((response: OrganizationSearchResponse) => {
      this.length = response.total;
      this.dataSource = new MatTableDataSource(response.data);
      this.paginator.length = response.total;
      this.table.dataSource = this.dataSource;
    }, error => {
      this.alertifyService.error('Can not load beneficiaries');
      console.log('error ' + JSON.stringify(error));
    });  
}
 onSearch(){
 this.getOrganizations();
 }
//  getLookupTypes(){
//   this.lookupService.getLookupTypes().subscribe((data: LookupType[])=>{
//     this.lookupTypes = data;
    
//   }
//     );
//  }
resetSearch(){
  this.pageIndex = 0;
  this.searchForm.reset();
  this.organizationSearchCriteria = new OrganizationSearchCriteria();
  this.getOrganizations();
}

pageChange(event){
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  this.length = event.length;
  this.getOrganizations();
}
 ngAfterViewInit() {
   //this.dataSource.sort = this.sort;
    }


 deleteLookupValue(valueId: number){
  //  console.log("id is >>>>>>>> "+valueId);
  // //  console.log("id is >>>>>>>> "+this.selectedLookupType);
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //    width: '30%',
  //    data: {title: 'Delete lookup', description: 'Are you sure to delete this lookup?'}
  //  });
  //   dialogRef.afterClosed().subscribe(result => {
  //    if (result === 1){
  //      this.lookupService.deleteLookupValue(valueId).subscribe((response: any)=>{
  //        this.dataSource.data.forEach((element,index)=>{
  //          if(element.valueId == valueId){
  //           //this.dataSource.data.splice(index, 1);
  //           element.isActive = false;
  //           this.dataSource.paginator = this.paginator;
  //         //this.table.renderRows();
  //           //delete this.dataSource.data[index];
  //          }
  //        });
  //        this.alertifyService.success('Lookup has been deleted');
  //      },error =>{
  //        this.alertifyService.error('Unable to delete the lookup');
  //      })
  //      console.log("delete yes clicked");
  //    }
  //  });
 }
 addLookup(){
   const dialogRef = this.dialog.open(AddLookupDialogComponent, {
     width: '60%',
     data: {}
   });
   dialogRef.afterClosed().subscribe(result => {
     if (result === 1){
       //this.getLookups();
     }
   });
 }
 lookupTypeChanged(event:any){
   console.log("lookup type changed and values is "+ event.value);
  if(event.value!= undefined){
      this.lookupService.getLookupValues(event.value).subscribe((lookupValueData:LookupValue[])=>{
      this.dataSource = new MatTableDataSource(lookupValueData);
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    }
      );
  }
  else{
    // if(this.lookupsForSelecteType!=undefined){
    //   this.lookupsForSelecteType.length=0;
    // }
  }
}

editLookupValue(lookupValue: LookupValue){
   if (!lookupValue){
     return;
   }
   this.lookupService.editLookupForm.patchValue({
     ...lookupValue
   });
   const dialogRef = this.dialog.open(EditLookupDialogComponent, {
     width: '60%',
     data: {}
   });
   dialogRef.afterClosed().subscribe(result => {
     if (result === 1){
       //this.getLookups();
     }
   });
 }
 makeActivelookupValue(valueId:number){
   this.lookupService.makeActiveLookupValue(valueId).subscribe((response: any)=>{
    this.dataSource.data.forEach((element,index)=>{
      // if(element.valueId == valueId){
      //  element.isActive = true;
      //  this.dataSource.paginator = this.paginator;
      // }
    });
    this.alertifyService.success('Lookup has been activatedd');
  },error =>{
    this.alertifyService.error('Unable to activate the lookup');
  })
 }


}
