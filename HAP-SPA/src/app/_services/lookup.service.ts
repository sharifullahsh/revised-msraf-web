import { InitialLookups } from './../models/InitialLookups';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UniqueLookupValueValidator } from '../shared/validator/uniqueLookupValueValidator';
import { LookupType } from '../models/Lookup';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  lookupTypes: LookupType[];
  baseUrl = environment.apiUrl;
  
  addLookupForm: FormGroup = this.fb.group({
    lookupCode:[null, Validators.required],
    valueCode: [null,
    {
      validators: [Validators.required],
      asyncValidators: [this.uniqueLookupValueValidator.validate.bind(this.uniqueLookupValueValidator)],
      updateOn: 'blur'
    }],
    enName: [null, Validators.required],
    drName: [null, Validators.required], 
    paName: [null, Validators.required]
  });

  editLookupForm: FormGroup = this.fb.group({
    valueId:[null],
    lookupCode:[null, Validators.required],
    valueCode: [null,Validators.required],
    enName: [null, Validators.required],
    drName: [null, Validators.required], 
    paName: [null, Validators.required]
  });
  
  constructor(private http: HttpClient,
    public uniqueLookupValueValidator: UniqueLookupValueValidator,
    public fb: FormBuilder) { }
  
  addLookupValue(){
    return this.http.post(this.baseUrl + 'lookup/saveLookupValue', this.addLookupForm.value);
  }
  editLookupValue(){
    return this.http.post(this.baseUrl + 'lookup/saveLookupValue/', this.editLookupForm.value);
  }
  getInitialLookups(): Observable<InitialLookups>{
    return this.http.get<InitialLookups>(this.baseUrl + 'lookup/initialLookups').pipe(map(response=>{
      return response;
    }));
  }
  
  getLookupValues(lookupCode: string){
    return this.http.get(this.baseUrl + 'lookup/lookupValues/'+lookupCode);
  }
  getLookupTypes(){
    return this.http.get(this.baseUrl + 'lookup/lookupTypes/');
  }
  deleteLookupValue(valueId: number) {
    return this.http.delete(this.baseUrl + 'lookup/deleteLookupValue/' + valueId);
  }
  makeActiveLookupValue(valueId: number) {
    return this.http.get(this.baseUrl + 'lookup/makeActiveLookupValue/' + valueId);
  }
  
  getDistrictLookups(provinceCode: string) {
    return this.http.get(this.baseUrl + 'lookup/districtLookups/' + provinceCode);
  }
}
