import { TippyCustomized } from '../../../Common/TippyCustomized'
import { TippyTheme } from '../../../Common/Types'
import { InfoIconTippyType } from '../../types'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { ReactComponent as HelpIcon } from '../../../Assets/Icon/ic-help.svg'
import { TIPPY_ICON_DIM } from '../../../Common/Constants'

export const InfoIconWithTippy = ({
    titleText,
    infoText,
    documentationLink,
    additionalContent,
    variant = TIPPY_ICON_DIM.LARGE,
}: InfoIconTippyType) => {
    let className: string
    switch (variant) {
        case 'SMALL':
            className = TIPPY_ICON_DIM.SMALL
            break
        case 'MEDIUM':
            className = TIPPY_ICON_DIM.MEDIUM
            break
        case 'LARGE':
            className = TIPPY_ICON_DIM.LARGE
            break
        default:
            className = TIPPY_ICON_DIM.MEDIUM
    }
    className += ' fcn-9 ml-8 cursor'
    return (
        <TippyCustomized
            theme={TippyTheme.white}
            className="w-300 h-100 fcv-5"
            placement="right"
            Icon={HelpIcon}
            heading={titleText}
            infoText={infoText}
            showCloseButton
            trigger="click"
            interactive
            documentationLink={documentationLink}
            documentationLinkText="View Documentation"
            additionalContent={additionalContent}
        >
            <button type="button" className={className} aria-label="TippyIcon">
                <ICHelpOutline />
            </button>
        </TippyCustomized>
    )
}

export default InfoIconWithTippy
