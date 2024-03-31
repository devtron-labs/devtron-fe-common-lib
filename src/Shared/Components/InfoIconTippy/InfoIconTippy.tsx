import { TippyCustomized } from '../../../Common/TippyCustomized'
import { TippyTheme } from '../../../Common/Types'
import { InfoIconTippyType } from '../../types'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { ReactComponent as HelpIcon } from '../../../Assets/Icon/ic-help.svg'

const InfoIconTippy = ({
    heading,
    infoText,
    iconClass = 'fcv-5',
    documentationLink,
    documentationLinkText,
    additionalContent,
    className = 'icon-dim-16',
    placement = 'bottom',
    dataTestid,
}: InfoIconTippyType) => (
    <TippyCustomized
        theme={TippyTheme.white}
        className="w-300 h-100 dc__no-text-transform"
        placement={placement}
        Icon={HelpIcon}
        heading={heading}
        infoText={infoText}
        iconClass={iconClass}
        showCloseButton
        trigger="click"
        interactive
        documentationLink={documentationLink}
        documentationLinkText={documentationLinkText}
        additionalContent={additionalContent}
    >
        <button
            type="button"
            className="p-0 dc__no-background dc__no-border dc__outline-none-imp flex ml-4 dc__tab-focus"
            aria-label="Info Icon"
            data-testid={dataTestid}
        >
            <ICHelpOutline className={className} />
        </button>
    </TippyCustomized>
)

export default InfoIconTippy
