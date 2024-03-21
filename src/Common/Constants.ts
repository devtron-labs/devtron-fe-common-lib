import { RegistryTypeDetailType } from './Types'

export const FALLBACK_REQUEST_TIMEOUT = 60000
export const Host = window?.__ORCHESTRATOR_ROOT__ ?? '/orchestrator'

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

export const URLS = {
    LOGIN_SSO: '/login/sso',
    PERMISSION_GROUPS: '/global-config/auth/groups',
}

export const ROUTES = {
    PROJECT_LIST_MIN: 'team/autocomplete',
    USER_CHECK_ROLE: 'user/check/roles',
    IMAGE_TAGGING: 'app/image-tagging',
    CD_MATERIAL_GET: 'app/cd-pipeline',
    DEPLOYMENT_TEMPLATE_LIST: 'app/template/list',
    INFRA_CONFIG_PROFILE: 'infra-config/profile',
}

export enum KEY_VALUE {
    KEY = 'key',
    VALUE = 'value',
}

export const DEFAULT_TAG_DATA = {
    key: '',
    value: '',
    propagate: false,
    isInvalidKey: false,
    isInvalidValue: false,
    isSuggested: true,
}

export const TOAST_ACCESS_DENIED = {
    TITLE: 'Access denied',
    SUBTITLE: 'You do not have required access to perform this action',
}

// Empty state messgaes
export const ERROR_EMPTY_SCREEN = {
    PAGE_NOT_FOUND: 'We could not find this page',
    PAGE_NOT_EXIST: 'This page doesn’t exist or was removed. We suggest you go back to home',
    TAKE_BACK_HOME: 'Take me home',
    ONLY_FOR_SUPERADMIN: 'Information on this page is available only to superadmin users.',
    NOT_AUTHORIZED: 'Not authorized',
    UNAUTHORIZED: 'unauthorized',
    FORBIDDEN: 'forbidden',
    REQUIRED_MANAGER_ACCESS:
        'Looks like you don’t have access to information on this page. Please contact your manager to request access.',
}
export const TOKEN_COOKIE_NAME = 'argocd.token'
export const TriggerTypeMap = {
    automatic: 'Auto',
    manual: 'Manual',
}

export const BuildStageVariable = {
    PreBuild: 'preBuildStage',
    Build: 'buildStage',
    PostBuild: 'postBuildStage',
}

export const REGISTRY_TYPE_MAP: Record<string, RegistryTypeDetailType> = {
    ecr: {
        value: 'ecr',
        label: 'ECR',
        desiredFormat: '(desired format: repo-name)',
        placeholderText: 'Eg. repo_name',
        gettingStartedLink: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/get-set-up-for-amazon-ecr.html',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: 'Eg. xxxxxxxxxxxx.dkr.ecr.region.amazonaws.com',
        },
        id: {
            label: 'Access key ID',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Secret access key',
            defaultValue: '',
            placeholder: '',
        },
    },
    'docker-hub': {
        value: 'docker-hub',
        label: 'Docker',
        desiredFormat: '(desired format: username/repo-name)',
        placeholderText: 'Eg. username/repo_name',
        gettingStartedLink: 'https://docs.docker.com/docker-hub/',
        defaultRegistryURL: 'docker.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password/Token (Recommended: Token)',
            defaultValue: '',
            placeholder: '',
        },
    },
    acr: {
        value: 'acr',
        label: 'Azure',
        desiredFormat: '(desired format: repo-name)',
        placeholderText: 'Eg. repo_name',
        gettingStartedLink:
            'https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL/Login Server',
            defaultValue: '',
            placeholder: 'Eg. xxx.azurecr.io',
        },
        id: {
            label: 'Username/Registry Name',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password',
            defaultValue: '',
            placeholder: '',
        },
    },
    'artifact-registry': {
        value: 'artifact-registry',
        label: 'Artifact Registry (GCP)',
        desiredFormat: '(desired format: project-id/artifacts-repo/repo-name)',
        placeholderText: 'Eg. project-id/artifacts-repo/repo-name',
        gettingStartedLink: 'https://cloud.google.com/artifact-registry/docs/manage-repos?hl=en_US',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: 'Eg. region-docker.pkg.dev',
        },
        id: {
            label: 'Username',
            defaultValue: '_json_key',
            placeholder: '',
        },
        password: {
            label: 'Service Account JSON File',
            defaultValue: '',
            placeholder: 'Paste json file content here',
        },
    },
    gcr: {
        value: 'gcr',
        label: 'GCR',
        desiredFormat: '(desired format: project-id/repo-name)',
        placeholderText: 'Eg. project-id/repo_name',
        gettingStartedLink: 'https://cloud.google.com/container-registry/docs/quickstart',
        defaultRegistryURL: 'gcr.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: 'gcr.io',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '_json_key',
            placeholder: '',
        },
        password: {
            label: 'Service Account JSON File',
            defaultValue: '',
            placeholder: 'Paste json file content here',
        },
    },
    quay: {
        value: 'quay',
        label: 'Quay',
        desiredFormat: '(desired format: username/repo-name)',
        placeholderText: 'Eg. username/repo_name',
        gettingStartedLink: '',
        defaultRegistryURL: 'quay.io',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Token',
            defaultValue: '',
            placeholder: '',
        },
    },
    other: {
        value: 'other',
        label: 'Other',
        desiredFormat: '',
        placeholderText: '',
        gettingStartedLink: '',
        defaultRegistryURL: '',
        registryURL: {
            label: 'Registry URL',
            defaultValue: '',
            placeholder: '',
        },
        id: {
            label: 'Username',
            defaultValue: '',
            placeholder: '',
        },
        password: {
            label: 'Password/Token',
            defaultValue: '',
            placeholder: '',
        },
    },
}

export const RepositoryAction = {
    CONTAINER: 'CONTAINER',
    CHART_PULL: 'CHART_PULL',
    CHART_PUSH: 'CHART_PUSH',
}

export enum MODES {
    YAML = 'yaml',
    JSON = 'json',
    SHELL = 'shell',
    DOCKERFILE = 'dockerfile',
}

export enum APPROVAL_MODAL_TYPE {
    CONFIG = 'CONFIG',
    DEPLOYMENT = 'DEPLOYMENT',
}
export const MAX_Z_INDEX = 2147483647

export const SELECTED_APPROVAL_TAB_STATE = {
    APPROVAL: 'approval',
    PENDING: 'pending',
}

export enum SortingOrder {
    /**
     * Ascending order
     */
    ASC = 'ASC',
    /**
     * Descending order
     */
    DESC = 'DESC',
}

/**
 * Base page size for pagination
 */
export const DEFAULT_BASE_PAGE_SIZE = 20

/**
 * Deployment Window
 */
export enum MODAL_TYPE {
    HIBERNATE = 'HIBERNATE',
    UNHIBERNATE = 'UNHIBERNATE',
    RESTORE = 'RESTORE',
    DEPLOY = 'DEPLOY',
    RESOURCE = 'RESOURCE',
    RESTART = 'RESTART',
    PIPELINE = 'PIPELINE',
    OVERVIEW = 'OVERVIEW',
    APP_DETAILS_STATUS = 'APP_DETAILS_STATUS',
}

export enum ACTION_STATE {
    ALLOWED = 'ALLOWED',
    PARTIAL = 'PARTIAL',
    BLOCKED = 'BLOCKED',
}

export enum DEPLOYMENT_WINDOW_TYPE {
    MAINTENANCE = 'MAINTENANCE',
    BLACKOUT = 'BLACKOUT',
}
export const arrowUnicode = '\u279d'

export enum WEEK_DAYS_ENUM {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
}

export enum FREQUENCY_ENUM {
    FIXED = 'FIXED',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
    WEEKLY_RANGE = 'WEEKLY_RANGE',
}

export const TIME_FORMAT = {
    DD_MMM_YYYY_HH_MM: 'DD MMM YYYY, hh:mm',
}

export function getOrdinal(number) {
    if (number % 100 >= 11 && number % 100 <= 13) {
        return `${number}th`
    }
    switch (number % 10) {
        case 1:
            return `${number}st`
        case 2:
            return `${number}nd`
        case 3:
            return `${number}rd`
        default:
            return `${number}th`
    }
}

export const TIME_HOUR_SUFFIX_FOR_12_HOUR_FORMAT = {
    AM: 'AM',
    PM: 'PM',
    MIDNIGHT: 'midnight',
    NOON: 'noon',
}

export const getTimeStampAMPMSuffix = (time: string): string => {
    // time is in format HH:mm 24hr format
    const [hoursStr, minutesStr] = time.split(':')
    const hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr, 10)

    if (hours === 12 && minutes === 0) {
        return TIME_HOUR_SUFFIX_FOR_12_HOUR_FORMAT.NOON
    }
    if (hours === 0 && minutes === 0) {
        return TIME_HOUR_SUFFIX_FOR_12_HOUR_FORMAT.MIDNIGHT
    }
    if (hours >= 12) {
        return TIME_HOUR_SUFFIX_FOR_12_HOUR_FORMAT.PM
    }
    return TIME_HOUR_SUFFIX_FOR_12_HOUR_FORMAT.AM
}

export enum ReactSelectInputAction {
    inputChange = 'input-change',
    selectOption = 'select-option',
    deselectOption = 'deselect-option',
    removeValue = 'remove-value',
}

export const ZERO_TIME_STRING = '0001-01-01T00:00:00Z'
