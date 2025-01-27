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

import { CATEGORY_LABELS } from './SecurityModal'
import { CATEGORIES, SUB_CATEGORIES } from './SecurityModal/types'
import { SecurityConfigType } from './types'

export const SECURITY_CONFIG: SecurityConfigType = {
    [CATEGORIES.IMAGE_SCAN]: {
        label: CATEGORY_LABELS.IMAGE_SCAN,
        subCategories: [SUB_CATEGORIES.VULNERABILITIES, SUB_CATEGORIES.LICENSE],
    },
    [CATEGORIES.CODE_SCAN]: {
        label: CATEGORY_LABELS.CODE_SCAN,
        subCategories: [
            SUB_CATEGORIES.VULNERABILITIES,
            SUB_CATEGORIES.LICENSE,
            SUB_CATEGORIES.MISCONFIGURATIONS,
            SUB_CATEGORIES.EXPOSED_SECRETS,
        ],
    },
    [CATEGORIES.KUBERNETES_MANIFEST]: {
        label: CATEGORY_LABELS.KUBERNETES_MANIFEST,
        subCategories: [SUB_CATEGORIES.MISCONFIGURATIONS, SUB_CATEGORIES.EXPOSED_SECRETS],
    },
}
