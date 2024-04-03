import { ScannedObjectBarProps } from './types'
import './styles.scss'

const ScannedObjectBar = ({
    criticalVulnerabilitiesCount,
    moderateVulnerabilitiesCount,
    lowVulnerabilitiesCount,
}: ScannedObjectBarProps) => {
    const totalVulnerabilitiesCount =
        criticalVulnerabilitiesCount + moderateVulnerabilitiesCount + lowVulnerabilitiesCount

    const renderScannedObject = (className: string, count: number) => (
        <div className={className} style={{ width: `${(100 * count) / totalVulnerabilitiesCount}%` }} />
    )

    const renderObjectCount = (count: number, title: string, objectIconClass: string) => (
        <p className="scanned-object__counts">
            <span className={`scanned-object__icon ${objectIconClass}`} />
            {title}
            <span className="fw-6 ml-5 mr-20">{count}</span>
        </p>
    )

    return (
        <>
            <div className="scanned-object__bar mb-16">
                {renderScannedObject('scanned-object__critical-count', criticalVulnerabilitiesCount)}
                {renderScannedObject('scanned-object__moderate-count', moderateVulnerabilitiesCount)}
                {renderScannedObject('scanned-object__low-count', lowVulnerabilitiesCount)}
            </div>

            <div className="flexbox">
                {renderObjectCount(criticalVulnerabilitiesCount, 'Critical', 'scanned-object__critical-count')}
                {renderObjectCount(moderateVulnerabilitiesCount, 'Moderate', 'scanned-object__moderate-count')}
                {renderObjectCount(lowVulnerabilitiesCount, 'Low', 'scanned-object__low-count')}
            </div>
        </>
    )
}

export default ScannedObjectBar
