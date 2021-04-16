import { AdminChangePassDialogComponent } from './../dialog/admin-change-pass-dialog/admin-change-pass-dialog.component';
import { DeleteDialogComponent } from 'src/app/shared/dialog/delete/delete-dialog.component';
import { UserService } from './../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AdminService } from '../../_services/admin.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Menu, RoleForRegistration, User } from '../../models/User';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../dialog/add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from '../dialog/edit-user-dialog/edit-user-dialog.component';
import { AddRoleDialogComponent } from '../dialog/add-role-dialog/add-role-dialog.component';
import { RoleService } from 'src/app/_services/role.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { EditRoleDialogComponent } from '../dialog/edit-role-dialog/edit-role-dialog.component';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;
   //@ViewChild(MatSort) sort: MatSort;
  
  dataSource: MatTableDataSource<User> ;
  dataSource2: MatTableDataSource<RoleForRegistration> ;

  searchKey: string;
  menus:Menu[];
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['userName', 'displayName','email', 'region','province', 'roles','actions'];
  displayedColumns2 = ['roleName','actions'];
 constructor(private adminService: AdminService,
             private alertifyService: AlertifyService,
             public dialog: MatDialog,
             public userService: UserService,
             public roleService:RoleService,
             public fb: FormBuilder,
             public authService: AuthService){
 }
  ngOnInit() {
    this.getAllUserWithRoles();  
    this.userService.getAvailableRoles();
    this.getAllRoles();
    this.menus=this.authService.currentUser.menu;
    console.log(this.authService.currentUser);
    console.log(this.authService.currentUser.region)    
    console.log(this.authService.currentUser.province)
  }
  getAllUserWithRoles(){
    this.userService.getAllUserWithRoles().subscribe((users: User[]) => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    }, error => {
      this.alertifyService.error(error);
    });
  }
  getAllRoles(){
    this.roleService.getAllRoles().subscribe((roles:RoleForRegistration[]) => {
      this.dataSource2 = new MatTableDataSource(roles);
      this.dataSource2.paginator = this.paginator2;
    }, error => {
      this.alertifyService.error(error);
    });
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
     }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyRoleFilter() {
    this.dataSource2.filter = this.searchKey.trim().toLowerCase();
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  clearFilter(){
    this.searchKey = '';
    this.applyFilter();
    this.applyRoleFilter();
  }
  deleteUser(userId: string){
     const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '30%',
      data: {title: 'Delete User', description: 'Are you sure to delete this user?'}
    });
     dialogRef.afterClosed().subscribe(result => {
      if (result === 1){
        this.userService.deleteUser(userId).subscribe((response: any)=>{
          this.getAllUserWithRoles();
          //this.table.renderRows();
          this.alertifyService.success('User has been deleted');
        },error =>{
          this.alertifyService.error('Unable to delete the user');
        })
        console.log("delete yes clicked");
      }
    });
  }
  addUser(){
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '60%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1){
        this.getAllUserWithRoles();
      }
    });
  }
  editUser(user: User){
    if (!user){
      return;
    }
    this.userService.editUserForm.patchValue({
      ...user
    });
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '60%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1){
        this.getAllUserWithRoles();
      }
    });
  }
  editRole(role: RoleForRegistration){
    if (!role){
      return;
    }  
   this.roleService.roleForm.controls.roleName.setValue(role.roleName);
   this.roleService.roleForm.controls.roleID.setValue(role.roleID);
   this.roleAccess.clear(); 
   role.roleAccess.forEach(x=>{
    this.roleAccess.push(this.fb.group({
      controller: x.controller,
      permission: [x.permission]
    }));
  })
  for(let i=0; i<this.menus.length;i++){
    let correct=0;
    for(let b=0;b<this.roleAccess.controls.length;b++){
      if(this.roleService.roleForm.value.roleAccess[b].controller===this.menus[i].controller){
      correct =1
      }
    }
    if(correct===0){
      this.roleAccess.push(this.fb.group({
        controller: this.menus[i].controller,
        permission: ['']
      }));
    }
   
 }
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      width: '60%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1){
        this.getAllRoles();        
        this.getAllUserWithRoles();
      }
    });
  }
  get roleAccess() : FormArray {
    return this.roleService.roleForm.get("roleAccess") as FormArray
  }
  addRole(){
    const dialogRef = this.dialog.open(AddRoleDialogComponent, {
      width: '60%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      
      if (result === 1){
        this.getAllRoles();
        this.getAllUserWithRoles();
      }
    });
  }

  changePassword(userId: string){
    if (!userId){
      return;
    }
    this.userService.adminChangePasswordForm.patchValue({
      id: userId
    });
    const dialogRef = this.dialog.open(AdminChangePassDialogComponent, {
      width: '40%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1){
      }
    });
  }
}
