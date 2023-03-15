export declare const RequestTimeout = 60000;
export declare const Host: string;
export declare const DOCUMENTATION_HOME_PAGE = "https://docs.devtron.ai";
export declare const DOCUMENTATION: {
    APP_TAGS: string;
    APP_OVERVIEW_TAGS: string;
};
export declare const PATTERNS: {
    KUBERNETES_KEY_PREFIX: RegExp;
    KUBERNETES_KEY_NAME: RegExp;
    START_END_ALPHANUMERIC: RegExp;
    ALPHANUMERIC_WITH_SPECIAL_CHAR: RegExp;
};
export declare const ROUTES: {
    PROJECT_LIST_MIN: string;
};
export declare enum KEY_VALUE {
    KEY = "key",
    VALUE = "value"
}
export declare const DEFAULT_TAG_DATA: {
    key: string;
    value: string;
    propagate: boolean;
    isInvalidKey: boolean;
    isInvalidValue: boolean;
    isSuggested: boolean;
};
export declare const TOAST_ACCESS_DENIED: {
    TITLE: string;
    SUBTITLE: string;
};
export declare const ERROR_EMPTY_SCREEN: {
    PAGE_NOT_FOUND: string;
    PAGE_NOT_EXIST: string;
    TAKE_BACK_HOME: string;
    ONLY_FOR_SUPERADMIN: string;
    NOT_AUTHORIZED: string;
    UNAUTHORIZED: string;
    FORBIDDEN: string;
    REQUIRED_MANAGER_ACCESS: string;
};
