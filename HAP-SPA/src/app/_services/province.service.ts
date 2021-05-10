import { Region } from './../models/Province';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LookupValueSelectList } from '../models/Lookup';
import { UniqueProvinceValidator } from '../shared/validator/uniqueProvinceValidator';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  regionList:Region[];
  baseUrl = environment.apiUrl;
  addProvinceForm: FormGroup = this.fb.group({
    provinceId: [null,
    {
      validators: [Validators.required],
      asyncValidators: [this.uniqueProvinceValidator.validate.bind(this.uniqueProvinceValidator)],
      updateOn: 'blur'
    }],
    regionId:[null, Validators.required],
    enName: [null, Validators.required],
    drName: [null, Validators.required],
    paName: [null, Validators.required],
  });

  editProvinceForm: FormGroup = this.fb.group({
    provinceId: [null],
    regionId:[null, Validators.required],
    enName: [null, Validators.required],
    drName: [null, Validators.required],
    paName: [null, Validators.required],
  });
  constructor(private http: HttpClient,
    public fb: FormBuilder,
    public uniqueProvinceValidator: UniqueProvinceValidator) { }
    getProvinces(searchCritria: any){
      return this.http.post(this.baseUrl + 'lookup/provinces',searchCritria, httpOptions);
    }
    getRegions(){
      return this.http.get(this.baseUrl + 'lookup/regions', httpOptions);
    }
    deleteProvince(provinceId: string) {
      return this.http.delete(this.baseUrl + 'lookup/deleteProvince/' + provinceId);
    }
    makeActiveProvince(provinceId: string) {
      return this.http.get(this.baseUrl + 'lookup/makeActiveProvince/' + provinceId);
    }
    addProvince(){
      return this.http.post(this.baseUrl + 'lookup/saveProvince', this.addProvinceForm.value);
    }
    editProvince(){
      return this.http.post(this.baseUrl + 'lookup/saveProvince/', this.editProvinceForm.value);
    }
}
