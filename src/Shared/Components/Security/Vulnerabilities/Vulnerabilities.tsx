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
import { EMPTY_STATE_STATUS } from '@Shared/constants'
import { Progressing, useAsync } from '../../../../Common'
import { ScannedByToolModal } from '../../ScannedByToolModal'
import { getLastExecutionByArtifactAppEnv } from './service'
import { VulnerabilitiesProps } from './types'
import { SecuritySummaryCard } from '../SecuritySummaryCard'
import { getSecurityScan } from '../SecurityModal'

const Vulnerabilities = ({
    isScanned,
    isScanEnabled,
    artifactId,
    applicationId,
    environmentId,
    setVulnerabilityCount,
    isScanV2Enabled,
}: VulnerabilitiesProps) => {
    const [areVulnerabilitiesLoading, vulnerabilitiesResponse, vulnerabilitiesError, reloadVulnerabilities] = useAsync(
        () => getLastExecutionByArtifactAppEnv(artifactId, applicationId, environmentId),
        [],
        isScanned && isScanEnabled && !isScanV2Enabled,
        {
            resetOnChange: false,
        },
    )

    const [scanResultLoading, scanResultResponse, scanResultError, reloadScanResult] = useAsync(
        () => getSecurityScan({ artifactId, appId: applicationId, envId: environmentId }),
        [],
        isScanned && isScanEnabled && isScanV2Enabled,
        {
            resetOnChange: false,
        },
    )

    useEffect(() => {
        if (scanResultResponse && isScanV2Enabled) {
            setVulnerabilityCount(scanResultResponse?.result?.imageScan?.vulnerability?.list?.length)
            return
        }
        if (vulnerabilitiesResponse && !isScanV2Enabled) {
            setVulnerabilityCount(vulnerabilitiesResponse.result.vulnerabilities?.length)
        }
    }, [vulnerabilitiesResponse, scanResultResponse])

    if (!isScanned) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Image was not scanned</p>
            </div>
        )
    }

    if (!isScanEnabled) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Scan is Disabled</p>
            </div>
        )
    }

    if (areVulnerabilitiesLoading || scanResultLoading) {
        return (
            <div className="security-tab-empty">
                <Progressing />
            </div>
        )
    }

    if (vulnerabilitiesError || scanResultError) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Failed to fetch vulnerabilities</p>
                <button
                    className="cta secondary"
                    type="button"
                    onClick={isScanV2Enabled ? reloadScanResult : reloadVulnerabilities}
                >
                    Reload
                </button>
            </div>
        )
    }

    if (vulnerabilitiesResponse.result.vulnerabilities.length === 0) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">
                    {EMPTY_STATE_STATUS.CI_DEATILS_NO_VULNERABILITY_FOUND.TITLE}
                </p>
                <p>{EMPTY_STATE_STATUS.CI_DEATILS_NO_VULNERABILITY_FOUND.SUBTITLE}</p>
                <p className="security-tab-empty__subtitle">{vulnerabilitiesResponse.result.lastExecution}</p>
                <p className="pt-8 pb-8 pl-16 pr-16 flexbox dc__align-items-center">
                    <ScannedByToolModal scanToolId={vulnerabilitiesResponse.result.scanToolId} />
                </p>
            </div>
        )
    }

    return (
        <div className="p-12">
            <SecuritySummaryCard
                severityCount={vulnerabilitiesResponse.result.severityCount}
                scanToolId={vulnerabilitiesResponse.result.scanToolId}
                {...(isScanV2Enabled
                    ? { appDetailsPayload: { appId: 7, envId: 2, artifactId: 235 } }
                    : { executionDetailsPayload: { appId: applicationId, envId: environmentId, artifactId } })}
            />
        </div>
    )
}

export default Vulnerabilities
