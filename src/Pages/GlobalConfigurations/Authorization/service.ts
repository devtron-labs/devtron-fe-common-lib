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

import { get, ResponseType, ROUTES } from '@Common/index'
import { SelectPickerOptionType } from '@Shared/Components'
import { API_TOKEN_PREFIX } from '@Shared/constants'
import { stringComparatorBySortOrder } from '@Shared/Helpers'
import { DefaultUserKey } from '@Shared/types'
import { GroupBase } from 'react-select'
import { UserMinType } from './types'
import { getUserAndApiTokenOption } from './utils'

// FIXME: Common out the typing and url from dashboard
export const getUserAndApiTokenOptions = async (): Promise<GroupBase<SelectPickerOptionType<string>>[]> => {
    const { result } = (await get(ROUTES.USER_LIST_MIN)) as ResponseType<UserMinType[]>

    if (!result) {
        return []
    }

    const sortedEmailList = result.map(({ emailId }) => emailId).sort(stringComparatorBySortOrder)

    return [
        {
            label: 'Users',
            options: sortedEmailList
                .filter((emailId) => emailId !== DefaultUserKey.system && !emailId.startsWith(API_TOKEN_PREFIX))
                .map((emailId) => getUserAndApiTokenOption(emailId)),
        },
        {
            label: 'API Tokens',
            options: sortedEmailList
                .filter((emailId) => emailId.startsWith(API_TOKEN_PREFIX))
                .map((emailId) => getUserAndApiTokenOption(emailId)),
        },
    ]
}
