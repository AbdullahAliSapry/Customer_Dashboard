export enum DayOfWeekEnum {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}
export interface StoreHouresWorkInterfafce {
  id: number;
  dayOfWeek: DayOfWeekEnum;
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
  storeId: number;
}
