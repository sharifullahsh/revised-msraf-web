import { ProvinceService } from './../../../_services/province.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-add-province-dialog',
  templateUrl: './add-province-dialog.component.html',
  styleUrls: ['./add-province-dialog.component.css']
})
export class AddProvinceDialogComponent implements OnInit {
  isProvinceSubmitted = false;
  constructor(
    public alertifyService: AlertifyService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddProvinceDialogComponent>,
    public provinceService: ProvinceService ) { }

get f(){
return this.provinceService.addProvinceForm.controls;
}

ngOnInit(): void {
}

cancelClick(){
  this.provinceService.addProvinceForm.reset();
  this.dialogRef.close();
}

addProvince(){
    this.isProvinceSubmitted = true;
    if ( this.provinceService.addProvinceForm.invalid){
    return;
    }
    this.provinceService.addProvince().subscribe((response: any) => {
    this.alertifyService.success('The organization has been created successfully');
    this.provinceService.addProvinceForm.reset();
    this.dialogRef.close(1);
    }, error => {
    this.alertifyService.error('Unable to add the organization');
    });

  }
}
