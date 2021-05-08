import { EditLookupDialogComponent } from './../dialog/edit-lookup-dialog/edit-lookup-dialog.component';
import { LookupService } from 'src/app/_services/lookup.service';
import { LookupValue, LookupType } from './../../models/Lookup';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from 'src/app/shared/dialog/delete/delete-dialog.component';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AddLookupDialogComponent } from '../dialog/add-lookup-dialog/add-lookup-dialog.component';
import { LookupSearch } from 'src/app/models/Search';

@Component({
  selector: 'app-general-lookups',
  templateUrl: './general-lookups.component.html',
  styleUrls: ['./general-lookups.component.css']
})
export class GeneralLookupsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatTable) table: MatTable<LookupValue>;
 dataSource: MatTableDataSource<LookupValue> ;

 /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
 displayedColumns = ['lookupCode', 'valueCode', 'enName', 'drName','paName','isActive','actions'];
 lookupsForSelecteType: LookupValue[];
 filterdLookupForSelecteType: LookupValue[];
 selectedLookupType: string;
constructor(
            private alertifyService: AlertifyService,
            public dialog: MatDialog,
            public lookupService: LookupService){
}
searchModel =  new LookupSearch();
 ngOnInit() {
   console.log("value is "+this.selectedLookupType);
   console.log("lookuptypes are "+ JSON.stringify(this.lookupService.lookupTypes));
   //this.lookupService.getAvailableRoles();
   this.lookupService.getLookupTypes().subscribe((data: LookupType[])=>{
    //assign the lookupTypes for use in dialogs
    this.lookupService.lookupTypes = data;
  });
   
 }
//  getLookupTypes(){
//   this.lookupService.getLookupTypes().subscribe((data: LookupType[])=>{
//     this.lookupTypes = data;
    
//   }
//     );
//  }
 getLookups(){
   this.lookupService.getLookupValues(this.searchModel.lookupType).subscribe((lookupValues: LookupValue[]) => {
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
   this.dataSource.filter = this.searchModel.lookupName.trim().toLowerCase();
   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }
 clearFilter(){
   this.searchModel.lookupName = '';
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
    this.getLookups();
    //   this.lookupService.getLookupValues(event.value).subscribe((lookupValueData:LookupValue[])=>{
    //   this.dataSource = new MatTableDataSource(lookupValueData);
    //   this.dataSource.paginator = this.paginator;
    //   this.table.dataSource = this.dataSource;
    // }
    //   );
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
