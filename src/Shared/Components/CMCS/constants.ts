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

import { CMSecretExternalType, CMSecretYamlData } from '@Shared/Services'
import { ConfigMapSecretDataTypeOptionType } from './types'

export const CONFIG_MAP_SECRET_YAML_PARSE_ERROR = 'Please provide valid YAML'
export const SECRET_TOAST_INFO = {
    BOTH_STORE_AVAILABLE: 'Please use either secretStore or secretStoreRef',
    CHECK_KEY_SECRET_KEY: 'Please check key and secretKey',
    BOTH_STORE_UNAVAILABLE: 'Please provide secretStore or secretStoreRef',
    CHECK_KEY_NAME: 'Please check key and name',
    BOTH_ESO_DATA_AND_DATA_FROM_AVAILABLE: 'Please use either esoData or esoDataFrom',
    BOTH_ESO_DATA_AND_DATA_FROM_UNAVAILABLE: 'Please provide esoData or esoDataFrom',
}

export const configMapDataTypeOptions: ConfigMapSecretDataTypeOptionType[] = [
    { value: '', label: 'Kubernetes ConfigMap' },
    { value: CMSecretExternalType.KubernetesConfigMap, label: 'Kubernetes External ConfigMap' },
]

export const CONFIG_MAP_SECRET_DEFAULT_CURRENT_DATA: CMSecretYamlData[] = [{ k: '', v: '', id: 0 }]

export const configMapSecretMountDataMap = {
    environment: { title: 'Environment Variable', value: 'environment' },
    volume: { title: 'Data Volume', value: 'volume' },
}
