export const RequestTimeout = 60000
export const Host = process.env.REACT_APP_ORCHESTRATOR_ROOT

export const PATTERNS = {
  KUBERNETES_KEY_PREFIX: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
  KUBERNETES_KEY_NAME: /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])$/,
  START_END_ALPHANUMERIC: /^([Az09].*[A-Za-z0-9])$|[A-Za-z0-9]$/,
  ALPHANUMERIC_WITH_SPECIAL_CHAR: /^[A-Za-z0-9._-]+$/, // allow alphanumeric,(.) ,(-),(_)
}

export const ROUTES = {
  PROJECT_LIST_MIN: 'team/autocomplete',
}