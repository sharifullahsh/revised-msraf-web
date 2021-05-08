import { LookupType, LookupValueSelectList } from 'src/app/models/Lookup';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  constructor(private http: HttpClient,
    public fb: FormBuilder) { }
    getOrganizations(searchCritria: any){
      return this.http.post(this.baseUrl + 'lookup/organizations',searchCritria, httpOptions);
    }
}
