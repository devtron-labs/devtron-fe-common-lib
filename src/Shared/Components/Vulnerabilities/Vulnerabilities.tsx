import { Progressing, ScanVulnerabilitiesTable } from '../../../Common'
import { ScannedByToolModal } from '../ScannedByToolModal'
import { NO_VULNERABILITY_TEXT } from './constants'
import { VulnerabilitiesProps } from './types'

const Vulnerabilities = ({
    isScanned,
    isScanEnabled,
    areVulnerabilitiesLoading,
    vulnerabilities,
    lastExecution,
    scanToolId,
    hasError,
    reloadVulnerabilities,
}: VulnerabilitiesProps) => {
    if (hasError) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">Failed to fetch vulnerabilities</p>
                <button className="cta secondary" type="button" onClick={reloadVulnerabilities}>
                    Reload
                </button>
            </div>
        )
    }

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

    if (!areVulnerabilitiesLoading && vulnerabilities.length === 0) {
        return (
            <div className="security-tab-empty">
                <p className="security-tab-empty__title">{NO_VULNERABILITY_TEXT.Secured}</p>
                <p>{NO_VULNERABILITY_TEXT.NoVulnerabilityFound}</p>
                <p className="security-tab-empty__subtitle">{lastExecution}</p>
                <p className="pt-8 pb-8 pl-16 pr-16 flexbox dc__align-items-center">
                    <ScannedByToolModal scanToolId={scanToolId} />
                </p>
            </div>
        )
    }

    return (
        <div className="security-tab">
            <div className="flexbox dc__content-space">
                <span className="flex left security-tab__last-scanned ">Scanned on {lastExecution} </span>
                <span className="flex right">
                    <ScannedByToolModal scanToolId={scanToolId} />
                </span>
            </div>

            <ScanVulnerabilitiesTable vulnerabilities={vulnerabilities} />
        </div>
    )
}

export default Vulnerabilities
