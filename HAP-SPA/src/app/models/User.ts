export interface User {
    id: string;
    userName: string;
    displayName: string;
    region?: string;
    roles?: string[];
    roleAccess: RoleAccess[];
    menu : Menu[];
    email:string;
    province:string;
    

}
export interface RoleAccess{
    controller:string;
permission:string;
}
export interface Menu{
    menuID:number;
    controller:string;
}
export interface RoleForRegistration{
    roleName: string ;  
    roleID:string;
    roleAccess: Array<Rights>;
}
export interface Rights
{
    controller:string;
     permission :Array<string>;
}
