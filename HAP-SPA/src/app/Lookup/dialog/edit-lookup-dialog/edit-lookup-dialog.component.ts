import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/Lookup';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-edit-lookup-dialog',
  templateUrl: './edit-lookup-dialog.component.html',
  styleUrls: ['./edit-lookup-dialog.component.css']
})
export class EditLookupDialogComponent implements OnInit {

  lookupSubmitted = false;
  lookupTypes: LookupType[];
  constructor(
              public alertifyService: AlertifyService,
              public fb: FormBuilder,
              public dialogRef: MatDialogRef<EditLookupDialogComponent>,
              public lookupService: LookupService ) { }

 get f(){
  return this.lookupService.editLookupForm.controls;
 }

  ngOnInit(): void {
   this.lookupTypes = this.lookupService.lookupTypes;
  }
  cancelClick(){
    this.lookupService.editLookupForm.reset();
    this.dialogRef.close();
  }

  editLookup(){
    this.lookupSubmitted = true;
    if ( this.lookupService.editLookupForm.invalid){
      return;
    }
    this.lookupService.editLookupValue().subscribe((response: any) => {
      this.alertifyService.success('The lookup has been updated successfully');
      this.lookupService.addLookupForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to updated the Lookup');
    });
  }




}
