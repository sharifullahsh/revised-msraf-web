import { Injectable, forwardRef, Directive } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
  NG_ASYNC_VALIDATORS} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map} from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UniqueOrganizationValidator implements AsyncValidator {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
      return this.isOrganizationCodeAvailable(ctrl.value).pipe(
      map(isTaken =>  (isTaken ? { uniqueOrganizationCode: true } : null)),
      catchError(() => of(null))
    );
  }
  isOrganizationCodeAvailable(organizationCode: string): Observable<any>{
      return this.http.get(this.baseUrl + 'lookup/isOrgCodeAvailable/' + organizationCode)
    } 
}
