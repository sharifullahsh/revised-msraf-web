export interface Lookup{
lookupCode: string;
lookupName: string;
metaData: string;
}
export interface LookupValue{
    valueId: number;
    lookupCode: string;
    valueCode: string;
    enName: string;
    drName: string;
    paName: string;
    isActive?: boolean;
    }

export interface LookupType{
    lookupCode: string;
    lookupName: string;
}
