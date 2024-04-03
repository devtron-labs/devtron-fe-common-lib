import { TippyCustomized } from '../../../Common/TippyCustomized'
import { TippyTheme, InfoIconTippyProps } from '../../../Common/Types'
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
    dataTestid = 'info-tippy-button',
    children,
}: InfoIconTippyProps) => (
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
        {children || (
            <button
                type="button"
                className="p-0 dc__no-background dc__no-border dc__outline-none-imp flex dc__tab-focus"
                aria-label="Info Icon"
                data-testid={dataTestid}
            >
                <ICHelpOutline className={className} />
            </button>
        )}
    </TippyCustomized>
)

export default InfoIconTippy
