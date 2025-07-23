export interface IProduct {
    id: number;
    name: string;
    description: string;
    createdat: Date;
    price: number;
    stock: number;
    discount: number;
    duration: number;
    startat?: Date;
    endat?: Date;
    imageid: number;
    categoryid: number;
    storeid: number;
}