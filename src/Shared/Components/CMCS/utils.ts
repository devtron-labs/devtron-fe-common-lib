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

import YAML from 'yaml'
import { GroupBase, OptionsOrGroups } from 'react-select'
import {
    CM_SECRET_STATE,
    CMSecretComponentType,
    CMSecretConfigData,
    CMSecretExternalType,
    CMSecretPayloadType,
    CMSecretYamlData,
    CODE_EDITOR_RADIO_STATE,
    ConfigDatum,
    ConfigMapSecretUseFormProps,
    ESOSecretData,
    GetConfigMapSecretFormInitialValuesParamsType,
    ProcessCMCSCurrentDataParamsType,
} from '@Shared/Services'
import { hasESO, OverrideMergeStrategyType } from '@Pages/index'
import { noop, YAMLStringify } from '@Common/Helper'
import { decode } from '@Shared/Helpers'
import { DEFAULT_SECRET_PLACEHOLDER } from '@Shared/constants'
import { ConfigMapSecretDataTypeOptionType, GetConfigMapSecretReadOnlyValuesParamsType } from './types'
import { getSelectPickerOptionByValue } from '../SelectPicker'
import {
    CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA,
    configMapDataTypeOptions,
    configMapSecretMountDataMap,
} from './constants'

export const getSecretDataTypeOptions = (
    isJob: boolean,
    isHashiOrAWS: boolean,
):
    | ConfigMapSecretDataTypeOptionType[]
    | OptionsOrGroups<ConfigMapSecretDataTypeOptionType, GroupBase<ConfigMapSecretDataTypeOptionType>> => {
    const kubernetesOptions: ConfigMapSecretDataTypeOptionType[] = [
        { value: '', label: 'Kubernetes Secret' },
        { value: CMSecretExternalType.KubernetesSecret, label: 'Mount Existing Kubernetes Secret' },
    ]

    const esoOptions: GroupBase<ConfigMapSecretDataTypeOptionType>[] = [
        {
            label: 'External Secret Operator (ESO)',
            options: [
                { value: CMSecretExternalType.ESO_GoogleSecretsManager, label: 'Google Secrets Manager' },
                { value: CMSecretExternalType.ESO_AWSSecretsManager, label: 'AWS Secrets Manager' },
                { value: CMSecretExternalType.ESO_AzureSecretsManager, label: 'Azure Secrets Manager' },
                { value: CMSecretExternalType.ESO_HashiCorpVault, label: 'Hashi Corp Vault' },
            ],
        },
    ]

    const kesOptions: GroupBase<ConfigMapSecretDataTypeOptionType>[] = [
        {
            label: 'Kubernetes External Secret (KES)',
            options: [
                {
                    value: CMSecretExternalType.AWSSecretsManager,
                    label: 'AWS Secrets Manager',
                    description: 'Deprecated',
                },
                {
                    value: CMSecretExternalType.AWSSystemManager,
                    label: 'AWS System Manager',
                    description: 'Deprecated',
                },
                {
                    value: CMSecretExternalType.HashiCorpVault,
                    label: 'Hashi Corp Vault',
                    description: 'Deprecated',
                },
            ],
        },
    ]

    return isJob ? kubernetesOptions : [...kubernetesOptions, ...esoOptions, ...(isHashiOrAWS ? kesOptions : [])]
}

const secureValues = (data: Record<string, string>, decodeData: boolean): CMSecretYamlData[] => {
    let decodedData = data || DEFAULT_SECRET_PLACEHOLDER

    if (decodeData) {
        try {
            decodedData = decode(data)
        } catch {
            noop()
        }
    }

    return Object.keys(decodedData).map((k, id) => ({
        k,
        v: typeof decodedData[k] === 'object' ? YAMLStringify(decodedData[k]) : decodedData[k],
        id,
    }))
}

const processCurrentData = ({
    configMapSecretData,
    cmSecretStateLabel,
    isSecret,
}: ProcessCMCSCurrentDataParamsType) => {
    if (configMapSecretData.mergeStrategy === OverrideMergeStrategyType.PATCH) {
        if (configMapSecretData.patchData) {
            return secureValues(configMapSecretData.patchData, isSecret && configMapSecretData.externalType === '')
        }

        return CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA
    }

    if (configMapSecretData.data) {
        return secureValues(configMapSecretData.data, isSecret && configMapSecretData.externalType === '')
    }

    if (cmSecretStateLabel === CM_SECRET_STATE.INHERITED && configMapSecretData.defaultData) {
        return secureValues(configMapSecretData.defaultData, isSecret && configMapSecretData.externalType === '')
    }

    return CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA
}

const processExternalSubPathValues = ({
    data,
    esoSubPath,
    external,
    subPath,
}: Pick<ConfigDatum, 'data' | 'esoSubPath' | 'subPath' | 'external'>) => {
    if (subPath && external && data) {
        return Object.keys(data).join(', ')
    }
    if (esoSubPath) {
        return esoSubPath.join(', ')
    }
    return ''
}

export const convertKeyValuePairToYAML = (currentData: CMSecretYamlData[]) =>
    currentData.length ? YAMLStringify(currentData.reduce((agg, { k, v }) => ({ ...agg, [k]: v }), {})) : ''

const getSecretDataFromConfigData = ({
    secretData,
    defaultSecretData,
    esoSecretData: baseEsoSecretData,
    defaultESOSecretData,
}: CMSecretConfigData): Pick<ConfigMapSecretUseFormProps, 'secretDataYaml' | 'esoSecretYaml'> => {
    let jsonForSecretDataYaml: string

    if (secretData?.length) {
        jsonForSecretDataYaml = YAMLStringify(secretData)
    } else if (defaultSecretData?.length) {
        jsonForSecretDataYaml = YAMLStringify(defaultSecretData)
    }

    const esoSecretData: Record<string, any> =
        !(baseEsoSecretData?.esoData || []).length &&
        !baseEsoSecretData?.template &&
        !baseEsoSecretData?.esoDataFrom &&
        defaultESOSecretData
            ? defaultESOSecretData
            : baseEsoSecretData

    const isEsoSecretData: boolean =
        (esoSecretData?.secretStore || esoSecretData?.secretStoreRef) &&
        (esoSecretData.esoData || esoSecretData.template || esoSecretData.esoDataFrom)

    return {
        secretDataYaml: jsonForSecretDataYaml ?? '',
        esoSecretYaml: isEsoSecretData ? YAMLStringify(esoSecretData) : '',
    }
}

export const getConfigMapSecretFormInitialValues = ({
    isJob,
    configMapSecretData,
    cmSecretStateLabel,
    componentType,
    skipValidation = false,
    fallbackMergeStrategy,
}: GetConfigMapSecretFormInitialValuesParamsType): ConfigMapSecretUseFormProps => {
    const isSecret = componentType === CMSecretComponentType.Secret

    const {
        name,
        external,
        externalType,
        type,
        mountPath,
        defaultMountPath,
        subPath,
        data,
        defaultData,
        filePermission,
        roleARN,
        esoSubPath,
    } = configMapSecretData || {}

    const commonInitialValues: ConfigMapSecretUseFormProps = {
        name: name ?? '',
        isSecret,
        external: external ?? false,
        externalType: externalType ?? CMSecretExternalType.Internal,
        selectedType: type ?? configMapSecretMountDataMap.environment.value,
        isFilePermissionChecked: !!filePermission,
        isSubPathChecked: !!subPath,
        filePermission: filePermission ?? '',
        volumeMountPath: mountPath ?? defaultMountPath ?? '',
        roleARN: roleARN ?? '',
        yamlMode: true,
        hasCurrentDataErr: false,
        isResolvedData: false,
        skipValidation,
        currentData: null,
        esoSecretYaml: null,
        externalSubpathValues: null,
        mergeStrategy: null,
        secretDataYaml: null,
        yaml: null,
    }

    if (configMapSecretData) {
        const defaultMergeStrategy = isJob || external ? OverrideMergeStrategyType.REPLACE : fallbackMergeStrategy
        const mergeStrategy =
            configMapSecretData.mergeStrategy ||
            (cmSecretStateLabel === CM_SECRET_STATE.INHERITED ? defaultMergeStrategy : null)

        const currentData = processCurrentData({
            configMapSecretData: { ...configMapSecretData, mergeStrategy },
            cmSecretStateLabel,
            isSecret,
        })

        return {
            ...commonInitialValues,
            externalSubpathValues: processExternalSubPathValues({
                data: data || defaultData,
                external,
                subPath,
                esoSubPath,
            }),
            yaml: convertKeyValuePairToYAML(currentData),
            currentData,
            mergeStrategy,
            ...getSecretDataFromConfigData(configMapSecretData),
        }
    }

    return {
        ...commonInitialValues,
        externalSubpathValues: '',
        yaml: '"": ""\n',
        currentData: CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA,
        esoSecretYaml: '{}',
        secretDataYaml: '[]',
        mergeStrategy: null,
    }
}

export const getConfigMapSecretReadOnlyValues = ({
    configMapSecretData,
    cmSecretStateLabel,
    componentType,
    isJob,
    fallbackMergeStrategy,
    displayKeys,
}: GetConfigMapSecretReadOnlyValuesParamsType) => {
    if (!configMapSecretData) {
        return {
            configData: [],
            data: null,
        }
    }

    const {
        external,
        externalType,
        esoSecretYaml,
        externalSubpathValues,
        filePermission,
        isSubPathChecked,
        roleARN,
        secretDataYaml,
        selectedType,
        volumeMountPath,
        yaml,
        currentData,
        isSecret,
    } = getConfigMapSecretFormInitialValues({
        isJob,
        configMapSecretData,
        cmSecretStateLabel,
        componentType,
        fallbackMergeStrategy,
    })
    const mountExistingExternal =
        external && externalType === (isSecret ? CMSecretExternalType.KubernetesSecret : CMSecretExternalType.Internal)

    let dataType = ''
    if (!isSecret) {
        dataType = configMapDataTypeOptions.find(({ value }) =>
            external && externalType === ''
                ? value === CMSecretExternalType.KubernetesConfigMap
                : value === externalType,
        ).label as string
    } else {
        dataType =
            external && externalType === ''
                ? CMSecretExternalType.KubernetesSecret
                : (getSelectPickerOptionByValue(getSecretDataTypeOptions(isJob, true), externalType).label as string)
    }

    return {
        configData: [
            {
                displayName: 'DataType',
                value: dataType,
                key: 'dataType',
            },
            {
                displayName: 'Mount data as',
                value: configMapSecretMountDataMap[selectedType].title,
                key: 'mountDataAs',
            },
            {
                displayName: 'Volume mount path',
                value: volumeMountPath,
                key: 'volumeMountPath',
            },
            {
                displayName: 'Set Sub Path',
                value:
                    (configMapSecretMountDataMap[selectedType].value === 'volume' &&
                        (isSubPathChecked ? 'True' : 'False')) ||
                    '',
                key: 'setSubPath',
            },
            {
                displayName: 'Subpath Values',
                value: externalSubpathValues,
                key: 'externalSubpathValues',
            },
            {
                displayName: 'File Permission',
                value: filePermission,
                key: 'filePermission',
            },
            {
                displayName: 'Role ARN',
                value: roleARN,
                key: 'roleArn',
            },
            ...(displayKeys
                ? [
                      {
                          displayName: 'Keys',
                          value: currentData?.length > 0 ? currentData.map((d) => d.k).join(', ') : 'No keys available',
                          key: 'keys',
                      },
                  ]
                : []),
        ],
        data: !mountExistingExternal ? (currentData?.[0]?.k && yaml) || esoSecretYaml || secretDataYaml : null,
    }
}

export const convertYAMLToKeyValuePair = (yaml: string): CMSecretYamlData[] => {
    try {
        const obj = yaml && YAML.parse(yaml)
        if (typeof obj !== 'object') {
            throw new Error()
        }
        const keyValueArray: CMSecretYamlData[] = Object.keys(obj).reduce((agg, k, id) => {
            if (!k && !obj[k]) {
                return CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA
            }
            const v = obj[k] && typeof obj[k] === 'object' ? YAMLStringify(obj[k]) : obj[k].toString()

            return [...agg, { k, v: v ?? '', id }]
        }, [])
        return keyValueArray
    } catch {
        return CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA
    }
}

export const getESOSecretDataFromYAML = (yaml: string): ESOSecretData => {
    try {
        const json = YAML.parse(yaml)
        if (typeof json === 'object') {
            const payload = {
                secretStore: json.secretStore,
                secretStoreRef: json.secretStoreRef,
                refreshInterval: json.refreshInterval,
                // if null don't send these keys which is achieved by `undefined`
                esoData: undefined,
                esoDataFrom: undefined,
                template: undefined,
            }
            if (Array.isArray(json?.esoData)) {
                payload.esoData = json.esoData
            }
            if (Array.isArray(json?.esoDataFrom)) {
                payload.esoDataFrom = json.esoDataFrom
            }
            if (typeof json?.template === 'object' && !Array.isArray(json.template)) {
                payload.template = json.template
            }
            return payload
        }
        return null
    } catch {
        return null
    }
}

export const getConfigMapSecretPayload = ({
    isSecret,
    external,
    externalType,
    externalSubpathValues,
    yaml,
    yamlMode,
    currentData,
    esoSecretYaml,
    filePermission,
    name,
    selectedType,
    isFilePermissionChecked,
    roleARN,
    volumeMountPath,
    isSubPathChecked,
    mergeStrategy,
}: ConfigMapSecretUseFormProps): CMSecretPayloadType => {
    const isESO = isSecret && hasESO(externalType)
    const _currentData = yamlMode ? convertYAMLToKeyValuePair(yaml) : currentData
    const data = _currentData.reduce((acc, curr) => {
        if (!curr.k) {
            return acc
        }
        const value = curr.v ?? ''

        return {
            ...acc,
            [curr.k]: isSecret && externalType === '' ? btoa(value) : value,
        }
    }, {})

    const payload: CMSecretPayloadType = {
        name,
        type: selectedType,
        external,
        data,
        roleARN: null,
        externalType: null,
        esoSecretData: null,
        mountPath: null,
        subPath: null,
        filePermission: null,
        esoSubPath: null,
        mergeStrategy,
    }

    if (
        (isSecret && externalType === CMSecretExternalType.KubernetesSecret) ||
        (!isSecret && external) ||
        (isSecret && isESO)
    ) {
        delete payload[CODE_EDITOR_RADIO_STATE.DATA]
    }
    if (isSecret) {
        payload.roleARN = ''
        payload.externalType = externalType

        if (isESO) {
            const esoSecretData = getESOSecretDataFromYAML(esoSecretYaml)
            if (esoSecretData) {
                payload.esoSecretData = {
                    secretStore: esoSecretData.secretStore,
                    esoData: esoSecretData.esoData,
                    secretStoreRef: esoSecretData.secretStoreRef,
                    refreshInterval: esoSecretData.refreshInterval,
                    esoDataFrom: esoSecretData.esoDataFrom,
                    template: esoSecretData.template,
                }
                payload.roleARN = roleARN
                if (isSubPathChecked && externalSubpathValues) {
                    payload.esoSubPath = externalSubpathValues.replace(/\s+/g, '').split(',')
                }
            }
        }
    }
    if (selectedType === configMapSecretMountDataMap.volume.value) {
        payload.mountPath = volumeMountPath
        payload.subPath = isSubPathChecked
        if (isFilePermissionChecked) {
            payload.filePermission = filePermission.length === 3 ? `0${filePermission}` : `${filePermission}`
        }

        if (
            isSubPathChecked &&
            ((isSecret && externalType === CMSecretExternalType.KubernetesSecret) || (!isSecret && external))
        ) {
            const externalSubpathKey = externalSubpathValues.replace(/\s+/g, '').split(',')
            const secretKeys = {}
            externalSubpathKey.forEach((key) => {
                secretKeys[key] = ''
            })
            payload.data = secretKeys
        }
    }

    return payload
}
