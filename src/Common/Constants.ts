export const RequestTimeout = 60000
export const Host = process.env.REACT_APP_ORCHESTRATOR_ROOT

export const DOCUMENTATION_HOME_PAGE = 'https://docs.devtron.ai'
export const DOCUMENTATION = {
    APP_TAGS: `${DOCUMENTATION_HOME_PAGE}/v/v0.6/usage/applications/create-application#tags`,
    APP_OVERVIEW_TAGS: `${DOCUMENTATION_HOME_PAGE}/v/v0.6/usage/applications/overview#manage-tags`,
}

export const PATTERNS = {
  KUBERNETES_KEY_PREFIX: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
  KUBERNETES_KEY_NAME: /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])$/,
  START_END_ALPHANUMERIC: /^([Az09].*[A-Za-z0-9])$|[A-Za-z0-9]$/,
  ALPHANUMERIC_WITH_SPECIAL_CHAR: /^[A-Za-z0-9._-]+$/, // allow alphanumeric,(.) ,(-),(_)
}

export const ROUTES = {
  PROJECT_LIST_MIN: 'team/autocomplete',
}

export enum KEY_VALUE {
  KEY= 'key',
  VALUE= 'value'
}

export const DEFAULT_TAG_DATA = { key: '', value: '', propagate: false, isInvalidKey: false, isInvalidValue: false }

export const TOAST_ACCESS_DENIED = {
  TITLE: 'Access denied',
  SUBTITLE: 'You do not have required access to perform this action',
}

// Empty state messgaes
export const ERROR_EMPTY_SCREEN = {
  PAGE_NOT_FOUND: 'We could not find this page',
  PAGE_NOT_EXIST: 'This page doesn’t exist or was removed. We suggest you go back to home',
  TAKE_BACK_HOME: 'Take me home',
}