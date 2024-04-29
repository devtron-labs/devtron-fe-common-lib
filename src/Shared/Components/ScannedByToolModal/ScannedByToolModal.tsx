import React from 'react'
import { IMAGE_SCAN_TOOL, SCAN_TOOL_ID_TRIVY } from '../../constants'
import { ScannedByToolModalProps } from './types'
import { ReactComponent as ICClair } from '../../../Assets/Icon/ic-clair.svg'
import { ReactComponent as ICTrivy } from '../../../Assets/Icon/ic-trivy.svg'

const ScannedByToolModal: React.FC<ScannedByToolModalProps> = ({
    scanToolId,
    fontSize = 13,
    spacingBetweenTextAndIcon = 6,
}) => {
    const isTrivy = scanToolId === SCAN_TOOL_ID_TRIVY

    return (
        <div className="flexbox" style={{ gap: `${spacingBetweenTextAndIcon}px` }}>
            <span className={`dc__italic-font-style fs-${fontSize}`}>
                Scanned by
                <span className="fw-6 ml-4" data-testid="scanned-by-tool">
                    {isTrivy ? IMAGE_SCAN_TOOL.Trivy : IMAGE_SCAN_TOOL.Clair}
                </span>
            </span>
            {isTrivy ? (
                <ICTrivy className="icon-dim-20 dc__no-shrink" />
            ) : (
                <ICClair className="icon-dim-20 dc__no-shrink" />
            )}
        </div>
    )
}

export default ScannedByToolModal
