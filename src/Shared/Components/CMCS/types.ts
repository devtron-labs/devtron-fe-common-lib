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
}

export interface GetConfigMapSecretReadOnlyValuesParamsType
    extends Pick<
        ConfigMapSecretReadyOnlyProps,
        'componentType' | 'configMapSecretData' | 'cmSecretStateLabel' | 'isJob' | 'fallbackMergeStrategy'
    > {}

export type ConfigMapSecretDataTypeOptionType = SelectPickerOptionType<string>
