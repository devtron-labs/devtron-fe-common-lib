/// <reference types="react" />
export declare function showError(serverError: any, showToastOnUnknownError?: boolean, hideAccessError?: boolean): void;
interface ConditionalWrapper<T> {
    condition: boolean;
    wrap: (children: T) => T;
    children: T;
}
export declare const ConditionalWrap: React.FC<ConditionalWrapper<any>>;
export declare function sortCallback(key: string, a: any, b: any, isCaseSensitive?: boolean): 1 | -1 | 0;
export {};
