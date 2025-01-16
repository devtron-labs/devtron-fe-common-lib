/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { getScanCompletedEmptyState, mapSeveritiesToSegmentedBarChartEntities } from '../utils'
import {
    ScanResultDTO,
    CATEGORIES,
    DetailViewDataType,
    EmptyStateType,
    InfoCardPropsType,
    KubernetesManifest,
    OpenDetailViewButtonProps,
    SUB_CATEGORIES,
    SecurityModalStateType,
    TablePropsType,
} from '../types'
import { SCAN_FAILED_EMPTY_STATE, SCAN_IN_PROGRESS_EMPTY_STATE } from '../constants'
import { getCodeScanExposedSecrets, getCodeScanMisconfigurations } from './CodeScan'

export const getKubernetesManifestTableData = (
    data: KubernetesManifest,
    subCategory: SecurityModalStateType['subCategory'],
    setDetailViewData: OpenDetailViewButtonProps['setDetailViewData'],
): TablePropsType => {
    switch (subCategory) {
        case SUB_CATEGORIES.MISCONFIGURATIONS:
            return getCodeScanMisconfigurations(
                data[subCategory],
                setDetailViewData,
                data.StartedOn,
                data.status,
                data.scanToolName,
            )
        case SUB_CATEGORIES.EXPOSED_SECRETS:
            return getCodeScanExposedSecrets(
                data[subCategory],
                setDetailViewData,
                data.StartedOn,
                data.status,
                data.scanToolName,
            )
        default:
            return null
    }
}

export const getKubernetesManifestInfoCardData = (
    data: KubernetesManifest,
    subCategory: SecurityModalStateType['subCategory'],
): InfoCardPropsType => {
    switch (subCategory) {
        case SUB_CATEGORIES.MISCONFIGURATIONS:
            return {
                entities: mapSeveritiesToSegmentedBarChartEntities(data[subCategory]?.misConfSummary.status),
                lastScanTimeString: data.StartedOn,
                scanToolName: data.scanToolName,
            }
        case SUB_CATEGORIES.EXPOSED_SECRETS:
            return {
                entities: mapSeveritiesToSegmentedBarChartEntities(data[subCategory]?.summary.severities),
                lastScanTimeString: data.StartedOn,
                scanToolName: data.scanToolName,
            }
        default:
            return null
    }
}

const getCompletedEmptyState = (
    data: KubernetesManifest,
    subCategory: SecurityModalStateType['subCategory'],
    detailViewData: DetailViewDataType,
) => {
    /* NOTE: check necessary to narrow the types to that which are compatible with KubernetesManifest */
    if (subCategory !== SUB_CATEGORIES.EXPOSED_SECRETS && subCategory !== SUB_CATEGORIES.MISCONFIGURATIONS) {
        return null
    }

    /* NOTE: if we are in detailView & it has data, no need for EmptyState */
    if ((data[subCategory]?.list?.length && !detailViewData) || detailViewData?.rows) {
        return null
    }

    const detailViewTitleText = detailViewData ? `${detailViewData.titlePrefix}: ${detailViewData.title}` : ''
    const subTitleText = detailViewTitleText || 'Kubernetes manifests'
    const { scanToolName } = data

    switch (subCategory) {
        case SUB_CATEGORIES.MISCONFIGURATIONS:
            /**
             * NOTE: if we are not in detail view then check for empty list in the subCategory;
             * otherwise the check for emptiness is done at start of the func  */
            return {
                ...getScanCompletedEmptyState(scanToolName),
                subTitle: `No misconfigurations found in ${subTitleText}`,
            }
        case SUB_CATEGORIES.EXPOSED_SECRETS:
            return {
                ...getScanCompletedEmptyState(scanToolName),
                subTitle: `No exposed secrets found in ${subTitleText}`,
            }
        default:
            return null
    }
}

export const getKubernetesManifestEmptyState = (
    data: ScanResultDTO,
    subCategory: SecurityModalStateType['subCategory'],
    detailViewData: DetailViewDataType,
): EmptyStateType => {
    switch (data[CATEGORIES.KUBERNETES_MANIFEST].status) {
        case 'Failed':
            return SCAN_FAILED_EMPTY_STATE
        /* FIXME: api is sending empty state for status after re-deployment */
        case 'Completed':
            return getCompletedEmptyState(data[CATEGORIES.KUBERNETES_MANIFEST], subCategory, detailViewData)
        case 'Progressing':
        case 'Running':
        default:
            return SCAN_IN_PROGRESS_EMPTY_STATE
    }
}
