export class LookupSearch {
    constructor(
      public lookupType?: string,
      public lookupName?: string
    ) {  }
  
  }
  export class OrganizationSearchCriteria{
    public organizationCategory?: string;
    public organizationName?: string;
    pageIndex: number;
    length: number;
    pageSize: number;
}
