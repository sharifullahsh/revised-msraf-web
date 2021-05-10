import { ProvinceService } from './../../../_services/province.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-edit-province-dialog',
  templateUrl: './edit-province-dialog.component.html',
  styleUrls: ['./edit-province-dialog.component.css']
})
export class EditProvinceDialogComponent implements OnInit {
  isProvinceSubmitted = false;
  constructor(
    public alertifyService: AlertifyService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProvinceDialogComponent>,
    public provinceService: ProvinceService ) { }

get f(){
return this.provinceService.editProvinceForm.controls;
}

ngOnInit(): void {
}
cancelClick(){
this.provinceService.editProvinceForm.reset();
this.dialogRef.close();
}

editProvince(){
this.isProvinceSubmitted = true;
if ( this.provinceService.editProvinceForm.invalid){
return;
}
this.provinceService.editProvince().subscribe((response: any) => {
this.alertifyService.success('The province has been updated successfully');
this.provinceService.editProvinceForm.reset();
this.dialogRef.close(1);
}, error => {
this.alertifyService.error('Unable to updated the province');
});
}

}
