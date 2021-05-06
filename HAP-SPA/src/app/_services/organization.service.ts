import { LookupType } from 'src/app/models/Lookup';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  lookupTypes: LookupType[];
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,
    public fb: FormBuilder) { }
    getOrganizationCategory(){
      return this.http.get(this.baseUrl + 'lookup/lookupTypes/');
    }
}
