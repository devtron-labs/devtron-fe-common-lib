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

import { useEffect, useState } from 'react'
import { Progressing, useAsync } from '../../../../Common'
import { VulnerabilitiesProps } from './types'
import { getSecurityScan } from '../SecurityModal/service'
import { SecurityCard } from '../SecurityDetailsCards'
import { CATEGORIES, SUB_CATEGORIES } from '../SecurityModal/types'
import { SecurityModal } from '../SecurityModal'
import { getStatusForScanList } from '../utils'

const Vulnerabilities = ({
    isScanned,
    isScanEnabled,
    artifactId,
    applicationId,
    environmentId,
    setVulnerabilityCount,
    SecurityModalSidebar,
}: VulnerabilitiesProps) => {
    const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false)
    const [scanResultLoading, scanResultResponse, scanResultError, reloadScanResult] = useAsync(
        () => getSecurityScan({ artifactId, appId: applicationId, envId: environmentId }),
        [],
        isScanned && isScanEnabled,
        {
            resetOnChange: false,
        },
    )

    useEffect(() => {
        if (scanResultResponse) {
            setVulnerabilityCount(scanResultResponse.result.imageScan?.vulnerability?.list?.[0].list?.length)
        }
    }, [scanResultResponse])

    if (scanResultLoading) {
        return (
            <div className="security-tab-empty bcn-1">
                <Progressing />
            </div>
        )
    }

    if (scanResultError) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Failed to fetch vulnerabilities</p>
                <button className="cta secondary" type="button" onClick={reloadScanResult}>
                    Reload
                </button>
            </div>
        )
    }

    if (!isScanEnabled || !scanResultResponse.result?.isImageScanEnabled) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Scan is Disabled</p>
            </div>
        )
    }

    if (!isScanned || !scanResultResponse.result?.scanned) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Image was not scanned</p>
            </div>
        )
    }

    const handleCardClick = () => {
        setShowSecurityModal(true)
    }

    const handleModalClose = () => {
        setShowSecurityModal(false)
    }

    const imageScanVulnerabilities = scanResultResponse.result?.imageScan?.vulnerability
    const imageScanList = imageScanVulnerabilities?.list || []

    const scanFailed: boolean = getStatusForScanList(imageScanList) === 'Failed'

    return (
        <div className="p-12">
            <SecurityCard
                category={CATEGORIES.IMAGE_SCAN}
                subCategory={SUB_CATEGORIES.VULNERABILITIES}
                severities={imageScanVulnerabilities?.summary?.severities}
                handleCardClick={handleCardClick}
                scanFailed={scanFailed}
            />
            {showSecurityModal && (
                <SecurityModal
                    isLoading={scanResultLoading}
                    error={scanResultError}
                    responseData={scanResultResponse?.result}
                    handleModalClose={handleModalClose}
                    Sidebar={SecurityModalSidebar}
                />
            )}
        </div>
    )
}

export default Vulnerabilities
