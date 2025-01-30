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

import { InfoCardPropsType, ScanResultDTO, CATEGORIES, SecurityModalStateType } from '../types'
import { getImageScanInfoCardData } from './ImageScan'
import { getCodeScanInfoCardData } from './CodeScan'
import { getKubernetesManifestInfoCardData } from './KubernetesManifest'

export const getInfoCardData = (
    data: ScanResultDTO,
    category: SecurityModalStateType['category'],
    subCategory: SecurityModalStateType['subCategory'],
): InfoCardPropsType => {
    switch (category) {
        case CATEGORIES.IMAGE_SCAN:
            return getImageScanInfoCardData(data[category], subCategory)
        case CATEGORIES.CODE_SCAN:
            return getCodeScanInfoCardData(data[category], subCategory)
        case CATEGORIES.KUBERNETES_MANIFEST:
            return getKubernetesManifestInfoCardData(data[category], subCategory)
        default:
            return null
    }
}
