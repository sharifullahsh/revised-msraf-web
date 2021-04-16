import { AlertifyService } from './../../../_services/alertify.service';
import { UniqueUserNameValidator } from './../../../shared/validator/uniqueUserNameValidator';
import { UserService } from './../../../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LookupService } from './../../../_services/lookup.service';
import { InitialLookups } from 'src/app/models/InitialLookups';
import { Lookup } from 'src/app/models/Lookup';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {
  userSubmitted = false;
  regions: Lookup[];
  provinces:Lookup[];
  allProvinces:Lookup[];
  constructor(public uniqueUserNameValidator: UniqueUserNameValidator,
              public alertifyService: AlertifyService,
              public fb: FormBuilder,
              public userService: UserService,
              public dialogRef: MatDialogRef<AddUserDialogComponent>,
              private lookupService: LookupService ) { }

 get f(){
  return this.userService.addUserForm.controls;
 }

  ngOnInit(): void {

  this.lookupService.getInitialLookups().subscribe(data => {
    this.regions = data.regions;
    this.allProvinces = data.provinces;
  } 
    );

  }
  cancelClick(){
    this.userService.addUserForm.reset();
    this.dialogRef.close();
  }
  RegionChanged(event:any){
    if(event.value!= undefined){
      this.provinces=this.allProvinces.filter(x=>x.metaData==this.regions.find(r=>r.lookupName==event.value).lookupCode);
    }
    else{
      if(this.provinces!=undefined){
        this.provinces.length=0;
      }
    }
  }
  addUser(){
    this.userSubmitted = true;
    if ( this.userService.addUserForm.invalid){
      return;
    }
    this.userService.addUser().subscribe((response: any) => {
      this.alertifyService.success('The user has been created successfully');
      this.userService.addUserForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to create the user');
    });
  }

}
