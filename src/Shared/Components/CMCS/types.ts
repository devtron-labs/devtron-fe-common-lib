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

import { OverrideMergeStrategyType } from '@Pages/index'
import { CM_SECRET_STATE, CMSecretComponentType, CMSecretConfigData } from '@Shared/Services'
import { SelectPickerOptionType } from '../SelectPicker'

export interface ConfigMapSecretReadyOnlyProps {
    configMapSecretData: CMSecretConfigData
    componentType: CMSecretComponentType
    cmSecretStateLabel: CM_SECRET_STATE
    isJob: boolean
    areScopeVariablesResolving: boolean
    fallbackMergeStrategy: OverrideMergeStrategyType
    hideCodeEditor?: boolean
    containerClassName?: string
    /**
     * @default false
     */
    displayKeys?: boolean
    /**
     * @default false
     */
    isBorderLess?: boolean
}

export interface GetConfigMapSecretReadOnlyValuesParamsType
    extends Pick<
        ConfigMapSecretReadyOnlyProps,
        | 'componentType'
        | 'configMapSecretData'
        | 'cmSecretStateLabel'
        | 'isJob'
        | 'fallbackMergeStrategy'
        | 'displayKeys'
    > {}

export type ConfigMapSecretDataTypeOptionType = SelectPickerOptionType<string>
