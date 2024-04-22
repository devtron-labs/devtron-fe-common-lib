import { DescriptorProps } from './types'
import { BreadCrumb } from '../../../Common'
import { BUILD_INFRA_TEXT } from './constants'
import { InfoIconTippy } from '../../../Shared'

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

            <InfoIconTippy
                infoText={tippyInfoText ?? BUILD_INFRA_TEXT.EDIT_DEFAULT_TOOLTIP}
                additionalContent={tippyAdditionalContent}
                heading={BUILD_INFRA_TEXT.HEADING}
                iconClassName="icon-dim-20"
            />
        </div>

        {children}
    </div>
)

export default Descriptor
