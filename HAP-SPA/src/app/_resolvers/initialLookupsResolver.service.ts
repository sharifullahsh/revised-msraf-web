import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InitialLookups } from '../models/InitialLookups';
import { AlertifyService } from '../_services/alertify.service';
import { LookupService } from '../_services/lookup.service';

@Injectable({
  providedIn: 'root'
})
export class InitialLookupsResolverService {
 constructor(private router: Router, private alertifyService: AlertifyService, private lookupService: LookupService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<InitialLookups> {
    return this.lookupService.getInitialLookups()
    .pipe(catchError(error => {
      this.alertifyService.error('Problems retrieving initial lookups');
      this.router.navigate(['/dashboard']);
      return of(null);
    }));
  }

}
