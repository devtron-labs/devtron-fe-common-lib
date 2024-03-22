import { DescriptorProps } from './types'
import { BreadCrumb, TippyCustomized, TippyTheme } from '../../../Common'
import { ReactComponent as Help } from '../../../Assets/Icon/ic-help.svg'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { BUILD_INFRA_TEXT } from './constants'

const Descriptor = ({
    additionalContainerClasses,
    breadCrumbs,
    children,
    tippyInfoText,
    tippyAdditionalContent,
}: DescriptorProps) => (
    <div className={`flexbox dc__content-space dc__align-items-center w-100 ${additionalContainerClasses ?? ''}`}>
        <div className="flexbox dc__align-items-center dc__gap-4">
            <BreadCrumb breadcrumbs={breadCrumbs} />

            <TippyCustomized
                theme={TippyTheme.white}
                className="w-300 h-100 dc__align-left"
                placement="right"
                Icon={Help}
                iconClass="fcv-5"
                infoText={tippyInfoText ?? BUILD_INFRA_TEXT.EDIT_DEFAULT_TOOLTIP}
                additionalContent={tippyAdditionalContent}
                heading={BUILD_INFRA_TEXT.HEADING}
                showCloseButton
                trigger="click"
                interactive
            >
                <button
                    className="p-0 h-20 dc__no-background dc__no-border dc__tab-focus"
                    type="button"
                    aria-label="build-infra-info"
                >
                    <ICHelpOutline className="icon-dim-20" />
                </button>
            </TippyCustomized>
        </div>

        {children}
    </div>
)

export default Descriptor
