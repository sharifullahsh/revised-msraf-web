import { AlertifyService } from './../../../_services/alertify.service';
import { UniqueUserNameValidator } from './../../../shared/validator/uniqueUserNameValidator';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LookupService } from './../../../_services/lookup.service';
import { RoleService } from 'src/app/_services/role.service';
import { Menu, RoleForRegistration } from 'src/app/models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss']
})
export class EditRoleDialogComponent implements OnInit {

  constructor(public uniqueUserNameValidator: UniqueUserNameValidator,
    public alertifyService: AlertifyService,
    public fb: FormBuilder,
    public roleService: RoleService,
    public dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private lookupService: LookupService,
    private authService:AuthService ) { }

  ngOnInit() {
  }
  get f(){
    return this.roleService.roleForm.controls;
   }
  editRole(){
    if ( this.roleService.roleForm.invalid){
      return;
    }
    this.roleService.editRole().subscribe((response: any) => {
      this.alertifyService.success('The role has been edited successfully');
      this.roleService.roleForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to edit the role');
    });
  }
  get roleAccess() : FormArray {
    return this.roleService.roleForm.get("roleAccess") as FormArray
  }
  cancelClick(){
    this.dialogRef.close();
  }

}
