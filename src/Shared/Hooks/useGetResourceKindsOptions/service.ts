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

import { getTeamListMin } from '@Common/Common.service'
import { Teams } from '@Common/Types'
import { stringComparatorBySortOrder } from '@Shared/Helpers'

export const getProjectOptions = async (): Promise<Pick<Teams, 'id' | 'name'>[]> => {
    const { result } = await getTeamListMin()

    if (!result) {
        return []
    }

    return result
        .map(({ id, name }) => ({
            id,
            name,
        }))
        .sort((a, b) => stringComparatorBySortOrder(a.name, b.name))
}
