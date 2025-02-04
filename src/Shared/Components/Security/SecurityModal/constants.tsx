/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import PageNotFound from '@Images/ic-page-not-found.svg'
import { ReactComponent as MechanicalOperation } from '@Icons/ic-mechanical-operation.svg'
import {
    CATEGORIES,
    SUB_CATEGORIES,
    SeveritiesDTO,
    SortOrderEnum,
    EmptyStateType,
    SecurityModalStateType,
} from './types'
import { ScanCategoriesWithLicense } from '../types'

export const DEFAULT_SECURITY_MODAL_IMAGE_STATE = {
    category: CATEGORIES.IMAGE_SCAN,
    subCategory: SUB_CATEGORIES.VULNERABILITIES,
    detailViewData: null,
}

const DEFAULT_SECURITY_MODAL_CODE_STATE = {
    category: CATEGORIES.CODE_SCAN,
    subCategory: SUB_CATEGORIES.VULNERABILITIES,
    detailViewData: null,
}

const DEFAULT_SECURITY_MODAL_MANIFEST_STATE = {
    category: CATEGORIES.KUBERNETES_MANIFEST,
    subCategory: SUB_CATEGORIES.MISCONFIGURATIONS,
    detailViewData: null,
}

export const getDefaultSecurityModalState = (
    categoriesConfig: Record<ScanCategoriesWithLicense, boolean>,
): SecurityModalStateType => {
    if (categoriesConfig.imageScan) {
        return DEFAULT_SECURITY_MODAL_IMAGE_STATE
    }
    if (categoriesConfig.codeScan) {
        return DEFAULT_SECURITY_MODAL_CODE_STATE
    }
    if (categoriesConfig.kubernetesManifest) {
        return DEFAULT_SECURITY_MODAL_MANIFEST_STATE
    }
    return DEFAULT_SECURITY_MODAL_IMAGE_STATE
}

export const CATEGORY_LABELS = {
    IMAGE_SCAN: 'Image Scan',
    CODE_SCAN: 'Code Scan',
    KUBERNETES_MANIFEST: 'Kubernetes Manifest',
} as const

export const SUB_CATEGORY_LABELS = {
    VULNERABILITIES: 'Vulnerability',
    LICENSE: 'License Risks',
    MISCONFIGURATIONS: 'Misconfigurations',
    EXPOSED_SECRETS: 'Exposed Secrets',
} as const

export const SEVERITIES = {
    [SeveritiesDTO.CRITICAL]: {
        label: 'Critical',
        color: 'var(--R700)',
    },
    [SeveritiesDTO.HIGH]: {
        label: 'High',
        color: 'var(--R500)',
    },
    [SeveritiesDTO.MEDIUM]: {
        label: 'Medium',
        color: 'var(--O500)',
    },
    [SeveritiesDTO.LOW]: {
        label: 'Low',
        color: 'var(--Y500)',
    },
    [SeveritiesDTO.UNKNOWN]: {
        label: 'Unknown',
        color: 'var(--N300)',
    },
    [SeveritiesDTO.FAILURES]: {
        label: 'Failures',
        color: 'var(--R500)',
    },
    [SeveritiesDTO.SUCCESSES]: {
        label: 'Successes',
        color: 'var(--G500)',
    },
    [SeveritiesDTO.EXCEPTIONS]: {
        label: 'Exceptions',
        color: 'var(--N300)',
    },
} as const

export const ORDERED_SEVERITY_KEYS = [
    SeveritiesDTO.CRITICAL,
    SeveritiesDTO.HIGH,
    SeveritiesDTO.MEDIUM,
    SeveritiesDTO.LOW,
    SeveritiesDTO.UNKNOWN,
    SeveritiesDTO.FAILURES,
    SeveritiesDTO.EXCEPTIONS,
    SeveritiesDTO.SUCCESSES,
] as const

export const SEVERITY_DEFAULT_SORT_ORDER = SortOrderEnum.DESC

export const SCAN_FAILED_EMPTY_STATE: EmptyStateType = {
    image: PageNotFound,
    title: 'Scan failed',
    subTitle: 'Error: Security scan failed',
}

export const SCAN_IN_PROGRESS_EMPTY_STATE: EmptyStateType = {
    SvgImage: MechanicalOperation,
    title: 'Scan in progress',
    subTitle: 'Scan result will be available once complete. Please check again later',
}

export const TRIVY_ICON_URL = 'https://cdn.devtron.ai/images/ic-trivy.webp'
