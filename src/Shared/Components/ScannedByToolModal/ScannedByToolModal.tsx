import { IMAGE_SCAN_TOOL, SCAN_TOOL_ID_TRIVY } from '../../constants'
import { ScannedByToolModalProps } from './types'
import { ReactComponent as ICClair } from '../../../Assets/Icon/ic-clair.svg'
import { ReactComponent as ICTrivy } from '../../../Assets/Icon/ic-trivy.svg'

const ScannedByToolModal = ({ scanToolId }: ScannedByToolModalProps) => {
    const isTrivy = scanToolId === SCAN_TOOL_ID_TRIVY

    return (
        <>
            <span className="dc__italic-font-style fs-13">
                Scanned by
                <span className="fw-6 ml-4" data-testid="scanned-by-tool">
                    {isTrivy ? IMAGE_SCAN_TOOL.Trivy : IMAGE_SCAN_TOOL.Clair}
                </span>
            </span>
            {isTrivy ? <ICTrivy className="h-20 w-20 ml-6" /> : <ICClair className="h-20 w-20 ml-6" />}
        </>
    )
}

export default ScannedByToolModal
