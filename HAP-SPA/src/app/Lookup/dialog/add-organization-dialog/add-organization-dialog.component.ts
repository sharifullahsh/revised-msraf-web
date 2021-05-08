import { OrganizationService } from './../../../_services/organization.service';
import { LookupType } from './../../../models/Lookup';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Lookup } from 'src/app/models/Lookup';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-add-lookup-dialog',
  templateUrl: './add-Organization-dialog.component.html',
  styleUrls: ['./add-Organization-dialog.component.css']
})
export class AddOrganizationDialogComponent implements OnInit {
  isOrgSubmitted = false;
 // lookupTypes: LookupType[];
  constructor(
              public alertifyService: AlertifyService,
              public fb: FormBuilder,
              public dialogRef: MatDialogRef<AddOrganizationDialogComponent>,
              public organizationService: OrganizationService ) { }

 get f(){
  return this.organizationService.addOrganizationForm.controls;
 }

  ngOnInit(): void {
   // this.lookupTypes = this.organizationService.lookupTypes;
  }

  cancelClick(){
    this.organizationService.addOrganizationForm.reset();
    this.dialogRef.close();
  }

  addOrganization(){
    this.isOrgSubmitted = true;
    if ( this.organizationService.addOrganizationForm.invalid){
      return;
    }
    this.organizationService.addOrganization().subscribe((response: any) => {
      this.alertifyService.success('The organization has been created successfully');
      this.organizationService.addOrganizationForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to add the organization');
    });
  }



}
