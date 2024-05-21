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

export enum DeploymentStageType {
    PRE = 'PRE',
    DEPLOY = 'DEPLOY',
    POST = 'POST',
}

export enum DeploymentWithConfigType {
    LAST_SAVED_CONFIG = 'LAST_SAVED_CONFIG',
    LATEST_TRIGGER_CONFIG = 'LATEST_TRIGGER_CONFIG',
    SPECIFIC_TRIGGER_CONFIG = 'SPECIFIC_TRIGGER_CONFIG',
}

export enum TIMELINE_STATUS {
    DEPLOYMENT_INITIATED = 'DEPLOYMENT_INITIATED',
    GIT_COMMIT = 'GIT_COMMIT',
    GIT_COMMIT_FAILED = 'GIT_COMMIT_FAILED',
    ARGOCD_SYNC = 'ARGOCD_SYNC',
    ARGOCD_SYNC_FAILED = 'ARGOCD_SYNC_FAILED',
    KUBECTL_APPLY = 'KUBECTL_APPLY',
    KUBECTL_APPLY_STARTED = 'KUBECTL_APPLY_STARTED',
    KUBECTL_APPLY_SYNCED = 'KUBECTL_APPLY_SYNCED',
    HEALTHY = 'HEALTHY',
    APP_HEALTH = 'APP_HEALTH',
    DEPLOYMENT_FAILED = 'FAILED',
    FETCH_TIMED_OUT = 'TIMED_OUT',
    UNABLE_TO_FETCH_STATUS = 'UNABLE_TO_FETCH_STATUS',
    DEGRADED = 'DEGRADED',
    DEPLOYMENT_SUPERSEDED = 'DEPLOYMENT_SUPERSEDED',
    ABORTED = 'ABORTED',
    INPROGRESS = 'INPROGRESS',
    HELM_PACKAGE_GENERATED = 'HELM_PACKAGE_GENERATED',
    HELM_MANIFEST_PUSHED_TO_HELM_REPO = 'HELM_MANIFEST_PUSHED_TO_HELM_REPO',
    HELM_MANIFEST_PUSHED_TO_HELM_REPO_FAILED = 'HELM_MANIFEST_PUSHED_TO_HELM_REPO_FAILED',
}

export const DEPLOYMENT_STATUS = {
    SUCCEEDED: 'succeeded',
    HEALTHY: 'healthy',
    FAILED: 'failed',
    TIMED_OUT: 'timed_out',
    UNABLE_TO_FETCH: 'unable_to_fetch',
    INPROGRESS: 'inprogress',
    PROGRESSING: 'progressing',
    STARTING: 'starting',
    INITIATING: 'initiating',
    SUPERSEDED: 'superseded',
    QUEUED: 'queued',
    UNKNOWN: 'unknown',
    CHECKING: 'checking',
} as const

export const statusIcon = {
    failed: 'failed',
    queued: 'queued',
    suspended: 'suspended',
    starting: 'progressing',
    initiating: 'progressing',
    unknown: 'unknown',
    degraded: 'degraded',
    healthy: 'healthy',
    notdeployed: 'not-deployed',
    missing: 'missing',
    progressing: 'progressing',
    deploymentinitiated: 'progressing',
    hibernating: 'hibernating',
    succeeded: 'healthy',
    timedout: 'timed-out',
    unabletofetch: 'failed',
}

export const APP_STATUS_HEADERS = ['KIND', 'NAME', 'STATUS', 'MESSAGE']

export const MATERIAL_EXCLUDE_TIPPY_TEXT =
    'Not available for build as this commit contains changes in excluded files or folders'
