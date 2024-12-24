/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { CATEGORY_LABELS, SUB_CATEGORY_LABELS } from '../constants'
import { CATEGORIES, SUB_CATEGORIES, SidebarDataType, SidebarPropsType } from '../types'

export const getSidebarData = (categoriesConfig: SidebarPropsType['categoriesConfig']): SidebarDataType[] => {
    const { imageScan, codeScan, kubernetesManifest } = categoriesConfig

    return [
        imageScan && {
            label: CATEGORY_LABELS.IMAGE_SCAN,
            isExpanded: true,
            children: [
                {
                    label: SUB_CATEGORY_LABELS.VULNERABILITIES,
                    value: {
                        category: CATEGORIES.IMAGE_SCAN,
                        subCategory: SUB_CATEGORIES.VULNERABILITIES,
                    },
                },
                {
                    label: SUB_CATEGORY_LABELS.LICENSE,
                    value: {
                        category: CATEGORIES.IMAGE_SCAN,
                        subCategory: SUB_CATEGORIES.LICENSE,
                    },
                },
            ],
        },
        codeScan && {
            label: CATEGORY_LABELS.CODE_SCAN,
            isExpanded: true,
            children: [
                {
                    label: SUB_CATEGORY_LABELS.VULNERABILITIES,
                    value: {
                        category: CATEGORIES.CODE_SCAN,
                        subCategory: SUB_CATEGORIES.VULNERABILITIES,
                    },
                },
                {
                    label: SUB_CATEGORY_LABELS.LICENSE,
                    value: {
                        category: CATEGORIES.CODE_SCAN,
                        subCategory: SUB_CATEGORIES.LICENSE,
                    },
                },
                {
                    label: SUB_CATEGORY_LABELS.MISCONFIGURATIONS,
                    value: {
                        category: CATEGORIES.CODE_SCAN,
                        subCategory: SUB_CATEGORIES.MISCONFIGURATIONS,
                    },
                },
                {
                    label: SUB_CATEGORY_LABELS.EXPOSED_SECRETS,
                    value: {
                        category: CATEGORIES.CODE_SCAN,
                        subCategory: SUB_CATEGORIES.EXPOSED_SECRETS,
                    },
                },
            ],
        },
        kubernetesManifest && {
            label: CATEGORY_LABELS.KUBERNETES_MANIFEST,
            isExpanded: true,
            children: [
                {
                    label: SUB_CATEGORY_LABELS.MISCONFIGURATIONS,
                    value: {
                        category: CATEGORIES.KUBERNETES_MANIFEST,
                        subCategory: SUB_CATEGORIES.MISCONFIGURATIONS,
                    },
                },
                {
                    label: SUB_CATEGORY_LABELS.EXPOSED_SECRETS,
                    value: {
                        category: CATEGORIES.KUBERNETES_MANIFEST,
                        subCategory: SUB_CATEGORIES.EXPOSED_SECRETS,
                    },
                },
            ],
        },
    ].filter((data) => !!data)
}
