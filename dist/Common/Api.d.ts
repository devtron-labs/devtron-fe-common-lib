import { ResponseType, APIOptions } from './Types';
export declare const post: (url: string, data: object, options?: APIOptions, isMultipartRequest?: boolean) => Promise<ResponseType>;
export declare const put: (url: string, data: object, options?: APIOptions) => Promise<ResponseType>;
export declare const get: (url: string, options?: APIOptions) => Promise<ResponseType>;
export declare const trash: (url: string, data?: object, options?: APIOptions) => Promise<ResponseType>;
