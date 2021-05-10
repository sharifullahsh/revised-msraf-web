import { Region } from './../../models/Province';
import { ProvinceService } from './../../_services/province.service';
import { ProvinceSearchedList, ProvinceSearchResponse } from './../../models/SearchResponse';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ProvinceSearchCriteria } from 'src/app/models/Search';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { LookupService } from 'src/app/_services/lookup.service';
import { LookupValue, LookupValueSelectList } from 'src/app/models/Lookup';
import { DeleteDialogComponent } from 'src/app/shared/dialog/delete/delete-dialog.component';
import { AddProvinceDialogComponent } from '../dialog/add-province-dialog/add-province-dialog.component';
import { Province } from 'src/app/models/Province';
import { EditProvinceDialogComponent } from '../dialog/edit-province-dialog/edit-province-dialog.component';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.css']
})
export class ProvinceComponent implements AfterViewInit, OnInit {
  provinceSearchCriteria:ProvinceSearchCriteria;
  pageIndex = 0;
  length = 100;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatTable) table: MatTable<ProvinceSearchedList>;
 dataSource: MatTableDataSource<ProvinceSearchedList> ;

 /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
 displayedColumns = ['#','provinceId', 'regionName', 'enName', 'drName','paName', 'isActive','actions'];


constructor(
            private alertifyService: AlertifyService,
            public provinceService: ProvinceService,
            public dialog: MatDialog,
            private fb: FormBuilder,
            public lookupService: LookupService){
}
searchForm = this.fb.group({
  regionId: [null],
  provinceName: [null]
});
 ngOnInit() {
   this.provinceSearchCriteria =  new ProvinceSearchCriteria();
   this.provinceService.getRegions().subscribe((data: Region[])=>{
    this.provinceService.regionList = data;
  });
   this.getProvinces();
 }
 getProvinces() {
  this.provinceSearchCriteria.pageIndex = this.pageIndex;
    this.provinceSearchCriteria.pageSize = this.pageSize;
    this.provinceSearchCriteria =  new ProvinceSearchCriteria();
    if(this.searchForm.get('regionId').value){
      this.provinceSearchCriteria.regionId = this.searchForm.get('regionId').value;
    }
    if(this.searchForm.get('provinceName').value){
      this.provinceSearchCriteria.provinceName = this.searchForm.get('provinceName').value.trim();
    }
 
    this.provinceSearchCriteria.pageSize = this.pageSize;
    this.provinceSearchCriteria.pageIndex = this.pageIndex;
    this.provinceService.getProvinces(this.provinceSearchCriteria).subscribe((response: ProvinceSearchResponse) => {
      this.length = response.total;
      this.dataSource = new MatTableDataSource(response.data);
      this.paginator.length = response.total;
      this.table.dataSource = this.dataSource;
    }, error => {
      this.alertifyService.error('Can not load provinces');
      console.log('error ' + JSON.stringify(error));
    });  
}
 onSearch(){
 this.getProvinces();
 }

resetSearch(){
  this.pageIndex = 0;
  this.searchForm.reset();
  this.provinceSearchCriteria = new ProvinceSearchCriteria();
  this.getProvinces();
}

pageChange(event){
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  this.length = event.length;
  this.getProvinces();
}
 ngAfterViewInit() {
   //this.dataSource.sort = this.sort;
    }


 deleteProvince(provinceId: string){
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
     width: '30%',
     data: {title: 'Delete Province', description: 'Are you sure to delete this province?'}
   });
    dialogRef.afterClosed().subscribe(result => {
     if (result === 1){
       this.provinceService.deleteProvince(provinceId).subscribe((response: any)=>{
         this.dataSource.data.forEach((element,index)=>{
           if(element.provinceId == provinceId){
            //this.dataSource.data.splice(index, 1);
            element.isActive = false;
            this.dataSource.paginator = this.paginator;
          //this.table.renderRows();
            //delete this.dataSource.data[index];
           }
         });
         this.alertifyService.success('Organization has been deleted');
       },error =>{
         this.alertifyService.error('Unable to delete the organization');
       })
       console.log("delete yes clicked");
     }
   });
 }
 addProvince(){
   const dialogRef = this.dialog.open(AddProvinceDialogComponent, {
     width: '60%',
     data: {}
   });
   dialogRef.afterClosed().subscribe(result => {
     if (result === 1){
       this.getProvinces();
     }
   });
 }

editProvince(province: Province){
   if (!province){
     return;
   }
   this.provinceService.editProvinceForm.patchValue({
     ...province
   });
   const dialogRef = this.dialog.open(EditProvinceDialogComponent, {
     width: '60%',
     data: {}
   });
   dialogRef.afterClosed().subscribe(result => {
     if (result === 1){
       this.getProvinces();
     }
   });
 }
 makeActiveProvince(provinceId:string){
   this.provinceService.makeActiveProvince(provinceId).subscribe((response: any)=>{
    this.dataSource.data.forEach((element,index)=>{
      if(element.provinceId == provinceId){
       element.isActive = true;
       this.dataSource.paginator = this.paginator;
      }
    });
    this.alertifyService.success('Province has been activatedd');
  },error =>{
    this.alertifyService.error('Unable to activate the province');
  }) 
 }


}
