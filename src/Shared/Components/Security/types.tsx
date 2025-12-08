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

import { CATEGORIES, ScanResultDTO, SUB_CATEGORIES } from './SecurityModal/types'

export type ScanCategories = (typeof CATEGORIES)[keyof typeof CATEGORIES]
export type ScanSubCategories = (typeof SUB_CATEGORIES)[keyof typeof SUB_CATEGORIES]

export type ScanCategoriesWithLicense = ScanCategories | 'imageScanLicenseRisks'

export type CategoriesConfig = {
    imageScan: boolean
    codeScan: boolean
    kubernetesManifest: boolean
}

interface SecurityConfigCategoryType {
    label: string
    subCategories: ScanSubCategories[]
}

export interface SecurityConfigType {
    imageScan?: SecurityConfigCategoryType
    codeScan?: SecurityConfigCategoryType
    kubernetesManifest?: SecurityConfigCategoryType
}

export interface GetSidebarDataParamsType extends Record<ScanCategoriesWithLicense, boolean> {
    selectedId: string
    scanResult: ScanResultDTO
}

export enum VulnerabilityDiscoveryAgeOptions {
    LESS_THAN_30_DAYS = 'lt_30d',
    BETWEEN_30_AND_60_DAYS = '30_60d',
    BETWEEN_60_AND_90_DAYS = '60_90d',
    GREATER_THAN_90_DAYS = 'gt_90d',
}

export enum FixAvailabilityOptions {
    FIX_AVAILABLE = 'fixAvailable',
    FIX_NOT_AVAILABLE = 'fixNotAvailable',
}
