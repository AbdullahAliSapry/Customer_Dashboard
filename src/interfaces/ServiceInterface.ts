export interface IService {
    id: number;
    name: string;
    description: string;
    createdat: Date;
    price: number;
    duration: number; // مدة الخدمة بالساعات
    categoryid: number;
    storeid: number;
    isActive: boolean;
    imageid?: number;
    startat?: Date;
    endat?: Date;
} 