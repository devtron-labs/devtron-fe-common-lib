/// <reference types="react" />
export declare function showError(serverError: any, showToastOnUnknownError?: boolean, hideAccessError?: boolean): void;
interface ConditionalWrapper<T> {
    condition: boolean;
    wrap: (children: T) => T;
    children: T;
}
export declare const ConditionalWrap: React.FC<ConditionalWrapper<any>>;
export {};
