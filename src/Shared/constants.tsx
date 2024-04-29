export const ARTIFACT_STATUS = {
    PROGRESSING: 'Progressing',
    DEGRADED: 'Degraded',
    FAILED: 'Failed',
}

export const STAGE_TYPE = {
    CD: 'CD',
    CI: 'CI',
    GIT: 'GIT',
    PRECD: 'PRECD',
    POSTCD: 'POSTCD',
    ROLLBACK: 'ROLLBACK',
}

export const SCAN_TOOL_ID_TRIVY = 3

export const IMAGE_SCAN_TOOL = {
    Clair: 'Clair',
    Trivy: 'Trivy',
}

export const EXCLUDED_IMAGE_TOOLTIP =
    'This image is excluded for new deployment as it does not match the filter conditions configured for this environment.'

export const ModuleNameMap = {
    ARGO_CD: 'argo-cd',
    CICD: 'cicd',
    SECURITY: 'security',
    BLOB_STORAGE: 'blob-storage',
    GRAFANA: 'monitoring.grafana',
    NOTIFICATION: 'notifier',
    SECURITY_TRIVY: 'security.trivy',
    SECURITY_CLAIR: 'security.clair',
}

// TODO: Convert to object later if more formats arise
export const DATE_TIME_FORMAT_STRING = 'ddd DD MMM YYYY HH:mm:ss'
export const API_TOKEN_PREFIX = 'API-TOKEN:'

export enum PatchOperationType {
    replace = 'replace',
    remove = 'remove',
}
