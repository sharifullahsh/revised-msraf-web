import { OrganizationService } from './../../../_services/organization.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/Lookup';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-edit-lookup-dialog',
  templateUrl: './edit-Organization-dialog.component.html',
  styleUrls: ['./edit-Organization-dialog.component.css']
})
export class EditOrganizationDialogComponent implements OnInit {

  isOrgSubmitted = false;
  lookupTypes: LookupType[];
  constructor(
              public alertifyService: AlertifyService,
              public fb: FormBuilder,
              public dialogRef: MatDialogRef<EditOrganizationDialogComponent>,
              public organizationService: OrganizationService ) { }

 get f(){
  return this.organizationService.editOrganizationForm.controls;
 }

  ngOnInit(): void {
   this.lookupTypes = this.organizationService.orgCategoryList;
  }
  cancelClick(){
    this.organizationService.editOrganizationForm.reset();
    this.dialogRef.close();
  }

  editOrganization(){
    this.isOrgSubmitted = true;
    if ( this.organizationService.editOrganizationForm.invalid){
      return;
    }
    this.organizationService.editOrganization().subscribe((response: any) => {
      this.alertifyService.success('The organization has been updated successfully');
      this.organizationService.editOrganizationForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to updated the organization');
    });
  }
}
