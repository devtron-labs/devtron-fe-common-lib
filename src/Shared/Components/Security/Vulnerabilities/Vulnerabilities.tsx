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

import { useEffect } from 'react'
import { EMPTY_STATE_STATUS, SCAN_TOOL_ID_TRIVY } from '@Shared/constants'
import { SeverityCount } from '@Shared/types'
import { Progressing } from '../../../../Common'
import { ScannedByToolModal } from '../../ScannedByToolModal'
import { VulnerabilitiesProps } from './types'
import { SecuritySummaryCard } from '../SecuritySummaryCard'
import { getSeverityCountFromSummary, getTotalSeverityCount } from '../utils'
import { useGetSecurityVulnerabilities } from './utils'
import { parseExecutionDetailResponse } from '../SecurityModal/utils'

const Vulnerabilities = ({
    isScanned,
    isScanEnabled,
    artifactId,
    applicationId,
    environmentId,
    setVulnerabilityCount,
    SecurityModalSidebar,
    getSecurityScan,
}: VulnerabilitiesProps) => {
    const isScanV2Enabled = window._env_.ENABLE_RESOURCE_SCAN_V2
    const { scanDetailsLoading, scanResultResponse, executionDetailsResponse, scanDetailsError, reloadScanDetails } =
        useGetSecurityVulnerabilities({
            appId: String(applicationId),
            envId: String(environmentId),
            artifactId: String(artifactId),
            isScanEnabled,
            isScanned,
            isScanV2Enabled,
            getSecurityScan,
        })

    useEffect(() => {
        if (scanResultResponse && isScanV2Enabled) {
            setVulnerabilityCount(scanResultResponse.result.imageScan.vulnerability?.list?.length)
            return
        }
        if (executionDetailsResponse && !isScanV2Enabled) {
            setVulnerabilityCount(executionDetailsResponse.result.vulnerabilities?.length)
        }
    }, [executionDetailsResponse, scanResultResponse])

    if (!isScanEnabled) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Scan is Disabled</p>
            </div>
        )
    }

    if (scanDetailsLoading) {
        return (
            <div className="security-tab-empty">
                <Progressing />
            </div>
        )
    }

    if (
        !isScanned ||
        (executionDetailsResponse && !executionDetailsResponse.result.scanned) ||
        (scanResultResponse && !scanResultResponse?.result.scanned)
    ) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Image was not scanned</p>
            </div>
        )
    }

    if (scanDetailsError) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Failed to fetch vulnerabilities</p>
                <button className="cta secondary" type="button" onClick={reloadScanDetails}>
                    Reload
                </button>
            </div>
        )
    }

    const scanResultSeverities = scanResultResponse?.result.imageScan.vulnerability?.summary.severities
    const severityCount: SeverityCount = isScanV2Enabled
        ? getSeverityCountFromSummary(scanResultSeverities)
        : executionDetailsResponse.result.severityCount ?? { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 }

    const totalCount = getTotalSeverityCount(severityCount)

    if (!totalCount) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">
                    {EMPTY_STATE_STATUS.CI_DEATILS_NO_VULNERABILITY_FOUND.TITLE}
                </p>
                <p>{EMPTY_STATE_STATUS.CI_DEATILS_NO_VULNERABILITY_FOUND.SUBTITLE}</p>
                <p className="security-tab-empty__subtitle">
                    {executionDetailsResponse?.result.lastExecution ??
                        scanResultResponse?.result.imageScan.vulnerability?.list[0].StartedOn}
                </p>
                <div className="pt-8 pb-8 pl-16 pr-16 flexbox dc__align-items-center">
                    <ScannedByToolModal
                        scanToolId={executionDetailsResponse?.result.scanToolId ?? SCAN_TOOL_ID_TRIVY}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="p-12">
            <SecuritySummaryCard
                severityCount={severityCount}
                scanToolId={executionDetailsResponse?.result.scanToolId ?? SCAN_TOOL_ID_TRIVY}
                responseData={
                    isScanV2Enabled
                        ? scanResultResponse?.result
                        : parseExecutionDetailResponse(executionDetailsResponse?.result)
                }
                isHelmApp={false} // Image card is not visible for helm app
                isSecurityScanV2Enabled={isScanV2Enabled}
                SecurityModalSidebar={SecurityModalSidebar}
            />
        </div>
    )
}

export default Vulnerabilities
