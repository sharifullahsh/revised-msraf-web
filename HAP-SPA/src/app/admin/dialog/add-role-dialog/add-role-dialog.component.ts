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
  selector: 'app-add-role-dialog',
  templateUrl: './add-role-dialog.component.html',
  styleUrls: ['./add-role-dialog.component.css']
})
export class AddRoleDialogComponent implements OnInit {

  menus:Menu[];

  constructor(public uniqueUserNameValidator: UniqueUserNameValidator,
    public alertifyService: AlertifyService,
    public fb: FormBuilder,
    public roleService: RoleService,
    public dialogRef: MatDialogRef<AddRoleDialogComponent>,
    private lookupService: LookupService,
    private authService:AuthService ) { }

  ngOnInit() {
    this.menus=this.authService.currentUser.menu;
    this.roleAccess.clear();
    this.menus.forEach(element => {
      this.roleAccess.push(this.fb.group({
        controller: element.controller,
        permission: ['']
      }));
    });
   
  }
  get f(){
    return this.roleService.roleForm.controls;
   }
   get roleAccess() : FormArray {
    return this.roleService.roleForm.get("roleAccess") as FormArray
  }
  addRole(){
    if ( this.roleService.roleForm.invalid){
      return;
    }
    this.roleService.addRole().subscribe((response: any) => {
      this.alertifyService.success('The role has been created successfully');
      this.roleService.roleForm.reset();
      this.dialogRef.close(1);
    }, error => {
      this.alertifyService.error('Unable to create the role');
    });
  }
 

  cancelClick(){
    this.dialogRef.close();
  }
}
