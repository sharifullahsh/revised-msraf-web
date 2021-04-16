/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InitialLookupsResolverService } from './initialLookupsResolver.service';

describe('Service: InitialLookupsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitialLookupsResolverService]
    });
  });

  it('should ...', inject([InitialLookupsResolverService], (service: InitialLookupsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
