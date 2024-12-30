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
import { hasESO, OverrideMergeStrategyType } from '@Pages/index'
import { createGitCommitUrl, handleUTCTime, noop, YAMLStringify } from '../../Common'
import {
    CIMaterialInfoDTO,
    CIMaterialInfoType,
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
} from './app.types'
import {
    CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA,
    configMapSecretMountDataMap,
    decode,
    DEFAULT_SECRET_PLACEHOLDER,
} from '..'

export const getParsedCIMaterialInfo = (ciMaterialData: CIMaterialInfoDTO): CIMaterialInfoType => {
    const materials = (ciMaterialData?.ciMaterials ?? []).map((mat, materialIndex) => ({
        id: mat.id,
        gitMaterialName: mat.gitMaterialName || '',
        gitMaterialId: mat.gitMaterialId || 0,
        gitURL: mat.url || '',
        type: mat.type || '',
        value: mat.value || '',
        active: mat.active || false,
        history: mat.history.map((hist, index) => ({
            commitURL: mat.url ? createGitCommitUrl(mat.url, hist.Commit) : '',
            commit: hist.Commit || '',
            author: hist.Author || '',
            date: handleUTCTime(hist.Date, false),
            message: hist.Message || '',
            changes: hist.Changes || [],
            showChanges: index === 0,
            webhookData: hist.WebhookData,
            isSelected: false,
        })),
        lastFetchTime: mat.lastFetchTime || '',
        isSelected: materialIndex === 0,
    }))

    return {
        ciPipelineId: ciMaterialData?.ciPipelineId,
        materials,
        triggeredByEmail: ciMaterialData?.triggeredByEmail || '',
        lastDeployedTime: handleUTCTime(ciMaterialData.lastDeployedTime, false),
        environmentName: ciMaterialData?.environmentName || '',
        environmentId: ciMaterialData?.environmentId || 0,
        appId: ciMaterialData?.appId,
        appName: ciMaterialData?.appName || '',
        appReleaseTags: ciMaterialData?.imageTaggingData?.appReleaseTags,
        imageComment: ciMaterialData?.imageTaggingData?.imageComment,
        imageReleaseTags: ciMaterialData?.imageTaggingData?.imageReleaseTags,
        image: ciMaterialData?.image,
        tagsEditable: ciMaterialData?.imageTaggingData?.tagsEditable,
    }
}

export const convertKeyValuePairToYAML = (currentData: CMSecretYamlData[]) =>
    currentData.length ? YAMLStringify(currentData.reduce((agg, { k, v }) => ({ ...agg, [k]: v }), {})) : ''

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
