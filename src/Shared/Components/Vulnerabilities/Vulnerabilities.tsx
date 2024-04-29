import { useEffect } from 'react'
import { Progressing, ScanVulnerabilitiesTable, useAsync } from '../../../Common'
import { ScannedByToolModal } from '../ScannedByToolModal'
import { NO_VULNERABILITY_TEXT } from './constants'
import { getLastExecutionByArtifactAppEnv } from './service'
import { VulnerabilitiesProps } from './types'

const Vulnerabilities = ({
    isScanned,
    isScanEnabled,
    artifactId,
    applicationId,
    environmentId,
    setVulnerabilityCount,
}: VulnerabilitiesProps) => {
    const [areVulnerabilitiesLoading, vulnerabilitiesResponse, vulnerabilitiesError, reloadVulnerabilities] = useAsync(
        () => getLastExecutionByArtifactAppEnv(artifactId, applicationId, environmentId),
        [],
        isScanned && isScanEnabled,
        {
            resetOnChange: false,
        },
    )

    useEffect(() => {
        if (vulnerabilitiesResponse) {
            setVulnerabilityCount(vulnerabilitiesResponse.result.vulnerabilities?.length)
        }
    }, [vulnerabilitiesResponse])

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

    if (areVulnerabilitiesLoading) {
        return (
            <div className="security-tab-empty">
                <Progressing />
            </div>
        )
    }

    if (vulnerabilitiesError) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Failed to fetch vulnerabilities</p>
                <button className="cta secondary" type="button" onClick={reloadVulnerabilities}>
                    Reload
                </button>
            </div>
        )
    }

    if (vulnerabilitiesResponse.result.vulnerabilities.length === 0) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">{NO_VULNERABILITY_TEXT.SECURED}</p>
                <p>{NO_VULNERABILITY_TEXT.NO_VULNERABILITY_FOUND}</p>
                <p className="security-tab-empty__subtitle">{vulnerabilitiesResponse.result.lastExecution}</p>
                <p className="pt-8 pb-8 pl-16 pr-16 flexbox dc__align-items-center">
                    <ScannedByToolModal scanToolId={vulnerabilitiesResponse.result.scanToolId} />
                </p>
            </div>
        )
    }

    return (
        <div className="security-tab">
            <div className="flexbox dc__content-space">
                <span className="flex left security-tab__last-scanned ">
                    Scanned on {vulnerabilitiesResponse.result.lastExecution}&nbsp;
                </span>
                <span className="flex right">
                    <ScannedByToolModal scanToolId={vulnerabilitiesResponse.result.scanToolId} />
                </span>
            </div>

            <ScanVulnerabilitiesTable vulnerabilities={vulnerabilitiesResponse.result.vulnerabilities} />
        </div>
    )
}

export default Vulnerabilities
