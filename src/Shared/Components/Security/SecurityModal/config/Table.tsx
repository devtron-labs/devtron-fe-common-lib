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

import { ScanResultDTO, CATEGORIES, OpenDetailViewButtonProps, SecurityModalStateType, TablePropsType } from '../types'
import { getImageScanTableData } from './ImageScan'
import { getCodeScanTableData } from './CodeScan'
import { getKubernetesManifestTableData } from './KubernetesManifest'

export const getTableData = (
    data: ScanResultDTO,
    category: SecurityModalStateType['category'],
    subCategory: SecurityModalStateType['subCategory'],
    setDetailViewData: OpenDetailViewButtonProps['setDetailViewData'],
    hidePolicy: boolean,
): TablePropsType => {
    switch (category) {
        case CATEGORIES.IMAGE_SCAN:
            return getImageScanTableData(data[category], subCategory, setDetailViewData, hidePolicy)
        case CATEGORIES.CODE_SCAN:
            return getCodeScanTableData(data[category], subCategory, setDetailViewData, hidePolicy)
        case CATEGORIES.KUBERNETES_MANIFEST:
            return getKubernetesManifestTableData(data[category], subCategory, setDetailViewData)
        default:
            return null
    }
}
