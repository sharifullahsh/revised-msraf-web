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
  
  constructor(private http: HttpClient,
    public uniqueLookupValueValidator: UniqueLookupValueValidator,
    public fb: FormBuilder) { }
  
  addLookupValue(){
    return this.http.post(this.baseUrl + 'lookup/addLookupValue', this.addLookupForm.value);
  }
  updateLookupValue(){
    return this.http.put(this.baseUrl + 'lookup/editLookupValue/', this.editLookupForm.value);
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
  getDistrictLookups(provinceCode: string) {
    return this.http.get(this.baseUrl + 'lookup/districtLookups/' + provinceCode);
  }
}
