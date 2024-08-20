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

import React, { ReactNode } from 'react'
import { CDModalTabType, VulnerabilityType } from '../../../Common'
import { MaterialSecurityInfoType } from '../../types'

export interface ImageCardAccordionProps extends MaterialSecurityInfoType {
    isSecurityModuleInstalled: boolean
    artifactId: number
    applicationId: number
    environmentId: number
    changesCard: ReactNode
    isScanned: boolean
    isScanEnabled: boolean
    isScanV2Enabled: boolean
}

export interface SecurityDetailsType {
    vulnerabilities: VulnerabilityType[]
    scanToolId: number
    lastExecution: string
}

export interface AccordionItemProps {
    currentTab: CDModalTabType
    activeTab: CDModalTabType
    setActiveTab: React.Dispatch<React.SetStateAction<CDModalTabType>>
    buttonText: string
}
