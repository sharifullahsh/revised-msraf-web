import { OrganizationSearch } from './../../models/Search';
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

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatTable) table: MatTable<LookupValue>;
 dataSource: MatTableDataSource<LookupValue> ;

 searchKey: string;
 /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
 displayedColumns = ['valueId', 'lookupCode', 'valueCode', 'enName', 'drName','paName','isActive','actions'];
 lookupTypes: LookupType[];
 lookupsForSelecteType: LookupValue[];
 filterdLookupForSelecteType: LookupValue[];
 selectedLookupType: string;
constructor(
            private alertifyService: AlertifyService,
            public dialog: MatDialog,
            public lookupService: LookupService){
}
SearchModel = new OrganizationSearch();
 ngOnInit() {
   console.log("value is "+this.selectedLookupType);
   console.log("lookuptypes are "+ JSON.stringify(this.lookupTypes));
   //this.lookupService.getAvailableRoles();
   this.lookupService.getLookupTypes().subscribe((data: LookupType[])=>{
    this.lookupTypes = data;
    //assign the lookupTypes for use in dialogs
    this.lookupService.lookupTypes = data;
  });
   
 }
 onSearch(){
   
 }
//  getLookupTypes(){
//   this.lookupService.getLookupTypes().subscribe((data: LookupType[])=>{
//     this.lookupTypes = data;
    
//   }
//     );
//  }
 getLookups(){
   this.lookupService.getLookupValues("TypeofIncident").subscribe((lookupValues: LookupValue[]) => {
     this.dataSource = new MatTableDataSource(lookupValues);
     this.dataSource.paginator = this.paginator;
     this.table.dataSource = this.dataSource;
   }, error => {
     this.alertifyService.error(error);
     console.log("error "+ JSON.stringify(error));
   });
 }

 ngAfterViewInit() {
   //this.dataSource.sort = this.sort;
    }
 applyFilter() {
   this.dataSource.filter = this.searchKey.trim().toLowerCase();
   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }
 clearFilter(){
   this.searchKey = '';
   this.applyFilter();
 }

 deleteLookupValue(valueId: number){
   console.log("id is >>>>>>>> "+valueId);
   console.log("id is >>>>>>>> "+this.selectedLookupType);
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
     width: '30%',
     data: {title: 'Delete lookup', description: 'Are you sure to delete this lookup?'}
   });
    dialogRef.afterClosed().subscribe(result => {
     if (result === 1){
       this.lookupService.deleteLookupValue(valueId).subscribe((response: any)=>{
         this.dataSource.data.forEach((element,index)=>{
           if(element.valueId == valueId){
            //this.dataSource.data.splice(index, 1);
            element.isActive = false;
            this.dataSource.paginator = this.paginator;
          //this.table.renderRows();
            //delete this.dataSource.data[index];
           }
         });
         this.alertifyService.success('Lookup has been deleted');
       },error =>{
         this.alertifyService.error('Unable to delete the lookup');
       })
       console.log("delete yes clicked");
     }
   });
 }
 addLookup(){
   const dialogRef = this.dialog.open(AddLookupDialogComponent, {
     width: '60%',
     data: {}
   });
   dialogRef.afterClosed().subscribe(result => {
     if (result === 1){
       this.getLookups();
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
    if(this.lookupsForSelecteType!=undefined){
      this.lookupsForSelecteType.length=0;
    }
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
       this.getLookups();
     }
   });
 }
 makeActivelookupValue(valueId:number){
   this.lookupService.makeActiveLookupValue(valueId).subscribe((response: any)=>{
    this.dataSource.data.forEach((element,index)=>{
      if(element.valueId == valueId){
       element.isActive = true;
       this.dataSource.paginator = this.paginator;
      }
    });
    this.alertifyService.success('Lookup has been activatedd');
  },error =>{
    this.alertifyService.error('Unable to activate the lookup');
  })
 }


}
