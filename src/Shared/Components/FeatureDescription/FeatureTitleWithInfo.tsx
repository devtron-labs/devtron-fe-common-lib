import { useState } from 'react'
import { DescriptorProps } from './types'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { BreadCrumb } from '../../../Common'
import { FeatureDescriptionModal } from './FeatureDescriptionModal'

const FeatureTitleWithInfo = ({
    additionalContainerClasses,
    breadCrumbs,
    children,
    iconClassName,
    title,
    renderDescriptionContent,
    closeModalText,
    docLink,
    SVGImage,
}: DescriptorProps) => {
    const [showFeatureDescriptionModal, setShowFeatureDescriptionModal] = useState(false)
    const onClickInfoIcon = () => {
        setShowFeatureDescriptionModal(true)
    }

    const closeModal = () => {
        setShowFeatureDescriptionModal(false)
    }
    return (
        <>
            <div
                className={`feature-description flexbox dc__content-space dc__align-items-center w-100 ${additionalContainerClasses ?? ''}`}
            >
                <div className="flexbox dc__align-items-center dc__gap-4">
                    <BreadCrumb breadcrumbs={breadCrumbs} />
                    <ICHelpOutline className={`${iconClassName} icon-dim-20 cursor`} onClick={onClickInfoIcon} />
                </div>

                {children}
            </div>
            {showFeatureDescriptionModal && (
                <FeatureDescriptionModal
                    title={title}
                    renderDescriptionContent={renderDescriptionContent}
                    closeModalText={closeModalText}
                    docLink={docLink}
                    closeModal={closeModal}
                    SVGImage={SVGImage}
                />
            )}
        </>
    )
}

export default FeatureTitleWithInfo
