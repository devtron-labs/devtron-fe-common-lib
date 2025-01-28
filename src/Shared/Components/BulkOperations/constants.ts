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

import { BulkOperationResultType } from './types'

export const COLOR_MAPPING = {
    Completed: 'var(--G500)',
    Pending: 'var(--N300)',
    Failed: 'var(--R500)',
}

export const RESULTS_MODAL_HEADERS: { label: string; isSortable: boolean; width: string }[] = [
    { label: 'resource', isSortable: true, width: '250px' },
    { label: 'status', isSortable: true, width: '100px' },
    { label: 'message', isSortable: false, width: '1fr' },
]

export const SORT_ORDER_TO_KEY: Partial<Record<(typeof RESULTS_MODAL_HEADERS)[number]['label'], string>> = {
    resource: 'name',
    status: 'status',
}

const STATUS_TO_VALUE: Record<Exclude<BulkOperationResultType['status'], 'Pending'>, number> = {
    Completed: 0,
    Failed: -2,
    Progressing: -3,
}

export const SORT_KEY_TO_NORMALIZER: Partial<Record<(typeof RESULTS_MODAL_HEADERS)[number]['label'], Function | null>> =
    {
        resource: null,
        status: (a: string) => STATUS_TO_VALUE[a],
    }

export type SORTABLE_KEYS_TYPE = (typeof SORT_ORDER_TO_KEY)[keyof typeof SORT_ORDER_TO_KEY]
