import { DOCUMENTATION } from '@Common/Constants'
import { ClipboardButton } from '@Common/index'

import { InfoIconTippy } from '..'
import { InstallFingerprintInfoProps } from './types'

const InstallationFingerprintInfo = ({ fingerprint, showHelpTooltip = false }: InstallFingerprintInfoProps) => (
    <div className="flexbox-col dc__gap-6">
        <div className="flexbox dc__align-items-center dc__gap-4">
            <span className="fs-13 lh-20 cn-7 fw-4">Installation Fingerprint</span>
            {showHelpTooltip && (
                <InfoIconTippy
                    heading="Installation Fingerprint"
                    infoText="A unique fingerprint to identify your Devtron Installation. An enterprise license is generated against an installation fingerprint."
                    documentationLinkText="Documentation"
                    iconClassName="icon-dim-20 fcn-6"
                    placement="right"
                    documentationLink={DOCUMENTATION.ENTERPRISE_LICENSE}
                />
            )}
        </div>
        <div className="flex dc__gap-8">
            <span className="cn-9 fs-13 lh-1-5 fw-4 dc__truncate">{fingerprint}</span>
            <ClipboardButton content={fingerprint} />
        </div>
    </div>
)

export default InstallationFingerprintInfo
