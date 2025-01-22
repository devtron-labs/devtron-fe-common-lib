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

import { get } from '@Common/Api'
import { ROUTES } from '@Common/Constants'
import { FloatingVariablesSuggestionsProps, ScopedVariableType } from './types'

const generateScope = (key: string | number, value: string | number) => {
    if (key && value) {
        return `"${key}":${value},`
    }
    return ''
}

const getScopedVariablesQuery = ({
    appId,
    envId,
    clusterId,
}: Pick<FloatingVariablesSuggestionsProps, 'appId' | 'envId' | 'clusterId'>) => {
    if (!appId) {
        return ''
    }

    let query = `?appId=${appId}&scope={`

    query += generateScope('appId', appId)
    query += generateScope('envId', envId)
    query += generateScope('clusterId', clusterId)

    if (query.endsWith(',')) {
        query = query.slice(0, -1)
    }

    query += '}'

    return query
}

export const getScopedVariables = async (
    appId: FloatingVariablesSuggestionsProps['appId'],
    envId: FloatingVariablesSuggestionsProps['envId'],
    clusterId: FloatingVariablesSuggestionsProps['clusterId'],
    hideObjectVariables: boolean = true,
): Promise<ScopedVariableType[]> => {
    const { result } = await get<ScopedVariableType[]>(
        `${ROUTES.SCOPED_GLOBAL_VARIABLES}${getScopedVariablesQuery({
            appId,
            envId,
            clusterId,
        })}`,
    )
    if (!result) {
        return []
    }

    if (hideObjectVariables) {
        return result.filter((variable) => !variable.variableValue || typeof variable.variableValue.value !== 'object')
    }

    return result
}
