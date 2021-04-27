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
    //public uniqueUserNameValidator: UniqueUserNameValidator,
              public alertifyService: AlertifyService,
              public fb: FormBuilder,
              //public userService: UserService,
              public dialogRef: MatDialogRef<EditLookupDialogComponent>,
              public lookupService: LookupService ) { }

 get f(){
  return this.lookupService.editLookupForm.controls;
 }

  ngOnInit(): void {

  // this.lookupService.getInitialLookups().subscribe(data => {
  //   this.regions = data.regions;
  //   this.allProvinces = data.provinces;
  // } 
  //   );
   // this.getLookupTypes();
   this.lookupTypes = this.lookupService.lookupTypes;
 console.log("edit form data "+ JSON.stringify(this.lookupService.editLookupForm.value));
  }
  // getLookupTypes(){
  //   this.lookupTypes = this.lookupService.getLookupTypes();
   
  //  }
  cancelClick(){
    this.lookupService.addLookupForm.reset();
    this.dialogRef.close();
  }

  updateLookup(){
    this.lookupSubmitted = true;
    if ( this.lookupService.addLookupForm.invalid){
      return;
    }
    this.lookupService.updateLookupValue().subscribe((response: any) => {
      this.alertifyService.success('The lookup has been created successfully');
      this.lookupService.addLookupForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to create the Lookup');
    });
  }




}
