import React from 'react'
import { DescriptorProps } from './types'
import { BreadCrumb, TippyCustomized, TippyTheme } from '../../Common'
import { ReactComponent as QuestionFilled } from '../../Assets/Icon/ic-help.svg'
import { ReactComponent as ICHelpOutline } from '../../Assets/Icon/ic-help-outline.svg'

const Descriptor = ({ additionalContainerClasses, breadCrumbs, children }: DescriptorProps) => {
    return (
        <div className={`flexbox dc__content-space dc__align-items-center w-100 ${additionalContainerClasses ?? ''}`}>
            <BreadCrumb breadcrumbs={breadCrumbs} />

            <TippyCustomized
                theme={TippyTheme.white}
                className="w-300 h-100 dc__align-left"
                placement="right"
                Icon={QuestionFilled}
                iconClass="fcv-5"
                infoText="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed nulla suscipit debitis ratione vel tenetur voluptate, pariatur, natus voluptatibus sint, at eos."
                heading="Build Infra"
                showCloseButton
                trigger="click"
                interactive
            >
                <button className="p-0 h-20 dc__no-background dc__no-border dc__outline-none-imp" type="button">
                    <ICHelpOutline className="icon-dim-20" />
                </button>
            </TippyCustomized>

            {children}
        </div>
    )
}

export default Descriptor
