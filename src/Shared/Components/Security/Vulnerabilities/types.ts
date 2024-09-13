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

import { MaterialSecurityInfoType } from '../../../types'
import { getSecurityScan } from '../SecurityModal'
import { getLastExecutionByArtifactAppEnv } from './service'

export interface VulnerabilitiesProps extends MaterialSecurityInfoType {
    artifactId: number
    applicationId: number
    environmentId: number
    setVulnerabilityCount: React.Dispatch<React.SetStateAction<number>>
    isScanV2Enabled: boolean
}

export interface UseGetSecurityVulnerabilitiesProps {
    artifactId: string
    appId: string
    envId: string
    isScanned: boolean
    isScanEnabled: boolean
    isScanV2Enabled: boolean
}

export interface UseGetSecurityVulnerabilitiesReturnType {
    scanDetailsLoading: boolean
    scanResultResponse: Awaited<ReturnType<typeof getSecurityScan>>
    executionDetailsResponse: Awaited<ReturnType<typeof getLastExecutionByArtifactAppEnv>>
    scanDetailsError: any
    reloadScanDetails: () => void
}
