export interface OrganizationSearchedList{
    organizationId?: string;
    organizationCode?: string;
    organizationName?: string;
    organizationCategory?: string;
    isActive?: boolean;
}
export interface OrganizationSearchResponse{
    data: OrganizationSearchedList[];
    total: number;
}