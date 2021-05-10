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
export class ProvinceSearchCriteria{
  public regionId?: string;
  public provinceName?: string;
  pageIndex: number;
  length: number;
  pageSize: number;
}