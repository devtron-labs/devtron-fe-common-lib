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

import { Progressing } from '@Common/Progressing'
import { hasHashiOrAWS } from '@Pages/index'

import { getConfigMapSecretReadOnlyValues } from './utils'
import { ConfigMapSecretReadyOnlyProps } from './types'
import { renderHashiOrAwsDeprecatedInfo } from './helpers'

const ConfigMapSecretReadyOnly = ({
    componentType,
    isJob,
    configMapSecretData,
    cmSecretStateLabel,
    areScopeVariablesResolving,
    fallbackMergeStrategy,
    hideCodeEditor = false,
    containerClassName,
    displayKeys = false,
    isBorderLess = false,
}: ConfigMapSecretReadyOnlyProps) => {
    const displayValues = getConfigMapSecretReadOnlyValues({
        configMapSecretData,
        cmSecretStateLabel,
        componentType,
        isJob,
        fallbackMergeStrategy,
        displayKeys,
    })

    return areScopeVariablesResolving ? (
        <Progressing fullHeight pageLoader />
    ) : (
        <div
            className={
                containerClassName ||
                `bg__primary flexbox-col dc__gap-12 dc__overflow-auto ${!hideCodeEditor ? 'p-16' : ''}`
            }
        >
            {hasHashiOrAWS(configMapSecretData?.externalType) && renderHashiOrAwsDeprecatedInfo()}
            <div
                className={`configmap-secret-container__display-values-container ${isBorderLess ? 'pl-22' : 'dc__border br-4 px-16 py-10'} dc__grid`}
            >
                {displayValues.configData.map(({ displayName, value }) =>
                    value ? (
                        <div key={displayName} className="dc__contents fs-13 lh-20 ">
                            <p className="m-0 w-150 cn-7">{displayName}</p>
                            <p className="m-0 flex-grow-1 cn-9 dc__word-break">{value}</p>
                        </div>
                    ) : null,
                )}
            </div>
            {!hideCodeEditor && displayValues.data && null}
        </div>
    )
}

export default ConfigMapSecretReadyOnly
