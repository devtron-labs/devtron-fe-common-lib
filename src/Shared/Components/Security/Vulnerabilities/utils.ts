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

import { numberComparatorBySortOrder } from '@Shared/Helpers'
import { SortingOrder, VULNERABILITIES_SORT_PRIORITY } from '../../../../Common'

export const getSortedVulnerabilities = (vulnerabilities) =>
    vulnerabilities.sort((a, b) =>
        numberComparatorBySortOrder(
            VULNERABILITIES_SORT_PRIORITY[a.severity],
            VULNERABILITIES_SORT_PRIORITY[b.severity],
            SortingOrder.ASC,
        ),
    )
