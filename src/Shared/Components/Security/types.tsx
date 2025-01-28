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

import { CATEGORIES, SUB_CATEGORIES } from './SecurityModal/types'

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
