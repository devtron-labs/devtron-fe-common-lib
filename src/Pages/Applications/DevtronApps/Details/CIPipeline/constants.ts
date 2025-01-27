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

import { SelectPickerOptionType } from '@Shared/Components'

export const IO_VARIABLES_VALUE_COLUMN_BOOL_OPTIONS: SelectPickerOptionType<string>[] = [
    { label: 'TRUE', value: 'TRUE' },
    { label: 'FALSE', value: 'FALSE' },
]

export const IO_VARIABLES_VALUE_COLUMN_DATE_OPTIONS: SelectPickerOptionType<string>[] = [
    {
        label: 'YYYY-MM-DD',
        value: 'YYYY-MM-DD',
        description: 'RFC 3339',
    },
    {
        label: 'YYYY-MM-DD HH:mm',
        value: 'YYYY-MM-DD HH:mm',
        description: 'RFC 3339 with minutes',
    },
    {
        label: 'YYYY-MM-DD HH:mm:ss',
        value: 'YYYY-MM-DD HH:mm:ss',
        description: 'RFC 3339 with seconds',
    },
    {
        label: 'YYYY-MM-DD HH:mm:ss-TZ',
        value: 'YYYY-MM-DD HH:mm:ssZ',
        description: 'RFC 3339 with seconds and timezone',
    },
    {
        label: "YYYY-MM-DDTHH'Z'ZZZZ",
        value: 'YYYY-MM-DDTHH[Z]',
        description: 'ISO8601 with hour',
    },
    {
        label: "YYYY-MM-DDTHH:mm'Z'ZZZZ",
        value: 'YYYY-MM-DDTHH:mm[Z]',
        description: 'ISO8601 with minutes',
    },
    {
        label: "YYYY-MM-DDTHH:mm:ss'Z'ZZZZ",
        value: 'YYYY-MM-DDTHH:mm:ss[Z]',
        description: 'ISO8601 with seconds',
    },
    {
        label: "YYYY-MM-DDTHH:mm:ss.SSSSSSSSS'Z'ZZZZ",
        value: 'YYYY-MM-DDTHH:mm:ss.SSSSSSSSS[Z]',
        description: 'ISO8601 with nanoseconds',
    },
]
