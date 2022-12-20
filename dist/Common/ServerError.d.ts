export declare class ServerError {
    code: number;
    internalMessage: string | null;
    userMessage: string | null;
    moreInfo?: string | null;
    constructor(error: any);
}
export declare class ServerErrors extends Error {
    code: number;
    errors: ServerError[];
    constructor(obj: {
        code: number;
        errors: ServerError[];
    });
}
