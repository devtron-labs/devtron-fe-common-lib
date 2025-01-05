import {
    CMSecretExternalType,
    configMapSecretMountDataMap,
    getConfigMapSecretFormInitialValues,
} from '@Shared/Services'
import { GroupBase, OptionsOrGroups } from 'react-select'
import { ConfigMapSecretDataTypeOptionType, GetConfigMapSecretReadOnlyValuesParamsType } from './types'
import { getSelectPickerOptionByValue } from '../SelectPicker'
import { configMapDataTypeOptions } from './constants'

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

export const getConfigMapSecretReadOnlyValues = ({
    configMapSecretData,
    cmSecretStateLabel,
    componentType,
    isJob,
    fallbackMergeStrategy,
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
        ],
        data: !mountExistingExternal ? (currentData?.[0]?.k && yaml) || esoSecretYaml || secretDataYaml : null,
    }
}
