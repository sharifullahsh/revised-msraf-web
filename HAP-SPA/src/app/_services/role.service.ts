import { AlertifyService } from './alertify.service';
import { UniqueUserNameValidator } from './../shared/validator/uniqueUserNameValidator';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
baseUrl = environment.apiUrl;
roleForm: FormGroup = this.fb.group({  
  roleID:null,
  roleName:[null, Validators.required],
  roleAccess:this.fb.array([])
});
constructor(public fb: FormBuilder,
  private http: HttpClient,
  public uniqueUserNameValidator: UniqueUserNameValidator,
  private alertifyService: AlertifyService) { }
  addRole(){
    return this.http.post(this.baseUrl + 'admin/addrole', this.roleForm.value);

  }
  editRole(){
    return this.http.post(this.baseUrl + 'admin/editRole', this.roleForm.value);

  }
  getAllRoles(){
    return this.http.get(this.baseUrl+'admin/getRoles');
  }

}
