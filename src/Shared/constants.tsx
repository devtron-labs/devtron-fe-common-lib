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

export const MATERIAL_TYPE = {
    ROLLBACK_MATERIAL_LIST: 'rollbackMaterialList',
    INPUT_MATERIAL_LIST: 'inputMaterialList',
    NONE: 'none',
}
