export interface Province{
    provinceId: string;
    regionId: string;
    regionName: string;
    enName: string;
    drName: string;
    paName: string;
    isActive?: boolean;
    }
export interface Region{
    regionID: string;
    enName: string;
    drName: string;
    paName: string;
    isActive?: boolean;
    }