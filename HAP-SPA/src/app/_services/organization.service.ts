import { UniqueOrganizationValidator } from './../shared/validator/uniqueOrganizationValidator';
import { LookupType, LookupValueSelectList } from 'src/app/models/Lookup';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  orgCategoryList: LookupValueSelectList[];
  baseUrl = environment.apiUrl;
  addOrganizationForm: FormGroup = this.fb.group({
    organizationCategory:[null, Validators.required],
    organizationCode: [null,
    {
      validators: [Validators.required],
      asyncValidators: [this.uniqueOrganizationValidator.validate.bind(this.uniqueOrganizationValidator)],
      updateOn: 'blur'
    }],
    enName: [null, Validators.required],
  });

  editOrganizationForm: FormGroup = this.fb.group({
    organizationId:[null],
    lookupCode:[null, Validators.required],
    valueCode: [null,Validators.required],
    enName: [null, Validators.required],
    drName: [null, Validators.required], 
    paName: [null, Validators.required]
  });
  constructor(private http: HttpClient,
    public fb: FormBuilder,
    public uniqueOrganizationValidator: UniqueOrganizationValidator) { }
    getOrganizations(searchCritria: any){
      return this.http.post(this.baseUrl + 'lookup/organizations',searchCritria, httpOptions);
    }
    deleteOrganization(organizationId: number) {
      return this.http.delete(this.baseUrl + 'lookup/deleteOrganization/' + organizationId);
    }
    makeActiveOrganization(organizationId: number) {
      return this.http.get(this.baseUrl + 'lookup/makeActiveOrganization/' + organizationId);
    }
    addOrganization(){
      return this.http.post(this.baseUrl + 'lookup/saveOrganization', this.addOrganizationForm.value);
    }
}
