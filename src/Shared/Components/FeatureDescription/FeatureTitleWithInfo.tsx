/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react'
import { DescriptorProps } from './types'
import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { BreadCrumb } from '../../../Common'
import { FeatureDescriptionModal } from './FeatureDescriptionModal'
import { InfoIconTippy } from '../InfoIconTippy'

const FeatureTitleWithInfo = ({
    additionalContainerClasses,
    breadCrumbs = [],
    children,
    iconClassName,
    title,
    renderDescriptionContent,
    closeModalText,
    docLink,
    SVGImage,
    showInfoIconTippy,
}: DescriptorProps) => {
    const [showFeatureDescriptionModal, setShowFeatureDescriptionModal] = useState(false)
    const onClickInfoIcon = () => {
        setShowFeatureDescriptionModal(true)
    }

    const closeModal = () => {
        setShowFeatureDescriptionModal(false)
    }

    const renderTitle = () => {
        if (breadCrumbs)
            <div className="flexbox dc__align-items-center dc__gap-4">
                <BreadCrumb breadcrumbs={breadCrumbs} />
                <ICHelpOutline className={`${iconClassName} icon-dim-20 cursor fcn-6`} onClick={onClickInfoIcon} />
            </div>
        else if (showInfoIconTippy) {
            return (
                <div>
                    {title}
                    <InfoIconTippy
                        heading={title}
                        infoText={renderDescriptionContent()}
                        iconClassName={iconClassName}
                        documentationLink={docLink}
                        documentationLinkText={docLink}
                        dataTestid="info-tippy-button"
                    />
                </div>
            )
        }
        return title
    }

    return (
        <>
            <div
                className={`feature-description flexbox dc__content-space dc__align-items-center w-100 ${additionalContainerClasses ?? ''}`}
            >
                {renderTitle()}

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
