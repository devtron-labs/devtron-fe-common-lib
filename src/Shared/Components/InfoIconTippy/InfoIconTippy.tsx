import { TippyCustomized } from '../../../Common/TippyCustomized'
import { TippyTheme } from '../../../Common/Types'
import { InfoIconTippyType } from '../../types'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { ReactComponent as HelpIcon } from '../../../Assets/Icon/ic-help.svg'
import { TIPPY_ICON_DIM } from '../../../Common/Constants'
import { getInfoIconTippyClass } from '../../../Common/AppStatus/utils'

const InfoIconTippy = ({
    heading,
    infoText,
    iconClass,
    documentationLink,
    additionalContent,
    variant = TIPPY_ICON_DIM.LARGE,
}: InfoIconTippyType) => {
    const className: string = getInfoIconTippyClass(variant)
    return (
        <TippyCustomized
            theme={TippyTheme.white}
            className="w-300 h-100"
            placement="right"
            Icon={HelpIcon}
            heading={heading}
            infoText={infoText}
            iconClass={iconClass}
            showCloseButton
            trigger="click"
            interactive
            documentationLink={documentationLink}
            documentationLinkText="View Documentation"
            additionalContent={additionalContent}
        >
            <button
                type="button"
                className={` p-0 h-20 dc__no-background dc__no-border dc__outline-none-imp flex`}
                aria-label="Info Icon"
            >
                <ICHelpOutline className={`${className} mx-16 fcn-6`} />
            </button>
        </TippyCustomized>
    )
}

export default InfoIconTippy
