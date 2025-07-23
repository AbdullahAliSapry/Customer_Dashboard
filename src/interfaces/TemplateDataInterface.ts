import { IPage } from "./PageInterface";


export interface ITemplateData{
    id: number;
    name: string;
    businesstype: BusinessType;
    path: string;
    foldername: string;
    pages: IPage[];
}


export enum BusinessType{
    restaurant = 1,
    cafe = 2,
    ecommerce = 3,
    event = 4,
    consulting = 5,
    service = 6,
    other = 7
}

