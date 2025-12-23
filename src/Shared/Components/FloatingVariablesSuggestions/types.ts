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

import { DraggableWrapperProps } from '@Common/DraggableWrapper'
import { AppConfigProps } from '@Pages/index'

export interface ScopedVariableType {
    variableName: string
    shortDescription: string | null
    variableValue?: {
        value: string | number | boolean | Record<string | number, unknown>
    } | null
    isRedacted: boolean
}

export interface FloatingVariablesSuggestionsProps
    extends Required<Pick<AppConfigProps, 'isTemplateView'>>,
        Pick<DraggableWrapperProps, 'boundaryGap'> {
    appId?: string
    envId?: string
    clusterId?: string
    /**
     * This will hide the variables with object/array values if set to true
     * @default true
     */
    hideObjectVariables?: boolean
    /**
     * @default true
     */
    showValueOnHover?: boolean
}

export interface SuggestionsProps extends Required<Pick<FloatingVariablesSuggestionsProps, 'showValueOnHover'>> {
    handleDeActivation: (e: React.MouseEvent<HTMLOrSVGElement>) => void
    loading: boolean
    variables: ScopedVariableType[]
    reloadVariables: () => void
    error: boolean
}

export interface SuggestionsItemProps extends Pick<SuggestionsProps, 'showValueOnHover'> {
    variableName: string
    description: string
    variableValue: Required<ScopedVariableType['variableValue']['value']>
    isRedacted: boolean
    highlightText: string
}
