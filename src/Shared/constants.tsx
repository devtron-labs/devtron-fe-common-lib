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
