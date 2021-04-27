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
    //public uniqueUserNameValidator: UniqueUserNameValidator,
              public alertifyService: AlertifyService,
              public fb: FormBuilder,
              //public userService: UserService,
              public dialogRef: MatDialogRef<AddLookupDialogComponent>,
              public lookupService: LookupService ) { }

 get f(){
  return this.lookupService.addLookupForm.controls;
 }

  ngOnInit(): void {

  // this.lookupService.getInitialLookups().subscribe(data => {
  //   this.regions = data.regions;
  //   this.allProvinces = data.provinces;
  // } 
  //   );
    //this.lookupTypes = this.lookupService.getLookupTypes();
    this.lookupTypes = this.lookupService.lookupTypes;
  }

  cancelClick(){
    this.lookupService.addLookupForm.reset();
    this.dialogRef.close();
  }
  // RegionChanged(event:any){
  //   if(event.value!= undefined){
  //     this.provinces=this.allProvinces.filter(x=>x.metaData==this.regions.find(r=>r.lookupName==event.value).lookupCode);
  //   }
  //   else{
  //     if(this.provinces!=undefined){
  //       this.provinces.length=0;
  //     }
  //   }
  // }
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
