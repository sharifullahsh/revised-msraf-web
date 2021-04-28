import { LookupType } from './../../../models/Lookup';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Lookup } from 'src/app/models/Lookup';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-add-lookup-dialog',
  templateUrl: './add-lookup-dialog.component.html',
  styleUrls: ['./add-lookup-dialog.component.css']
})
export class AddLookupDialogComponent implements OnInit {

  lookupSubmitted = false;
  lookupTypes: LookupType[];
  constructor(
              public alertifyService: AlertifyService,
              public fb: FormBuilder,
              public dialogRef: MatDialogRef<AddLookupDialogComponent>,
              public lookupService: LookupService ) { }

 get f(){
  return this.lookupService.addLookupForm.controls;
 }

  ngOnInit(): void {
    this.lookupTypes = this.lookupService.lookupTypes;
  }

  cancelClick(){
    this.lookupService.addLookupForm.reset();
    this.dialogRef.close();
  }

  addLookup(){
    this.lookupSubmitted = true;
    if ( this.lookupService.addLookupForm.invalid){
      return;
    }
    this.lookupService.addLookupValue().subscribe((response: any) => {
      this.alertifyService.success('The lookup has been created successfully');
      this.lookupService.addLookupForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to create the Lookup');
    });
  }



}
