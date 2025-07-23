export interface IResponseData<T> {
    message: string;
    data: T;
    isSuccess: boolean;
    statusCode: number;
}


