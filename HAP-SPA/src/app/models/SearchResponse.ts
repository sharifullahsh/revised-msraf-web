export interface OrganizationSearchedList{
    organizationId?: number;
    organizationCode?: string;
    enName?: string;
    organizationCategory?: string;
    organizationCategoryName?: string;
    isActive?: boolean;
}
export interface OrganizationSearchResponse{
    data: OrganizationSearchedList[];
    total: number;
}
export interface ProvinceSearchedList{
    provinceId?: string;
    regionId?: string;
    regionName?: string;
    enName?: string;
    drName?: string;
    paName?: string;
    isActive?: boolean;
}
export interface ProvinceSearchResponse{
    data: ProvinceSearchedList[];
    total: number;
}