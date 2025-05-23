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

import { ReactComponent as ICHelpOutline } from '../../../Assets/Icon/ic-help-outline.svg'
import { BreadCrumb } from '../../../Common'
import { InfoIconTippy } from '../InfoIconTippy'
import { FeatureDescriptionModal } from './FeatureDescriptionModal'
import { DescriptorProps } from './types'

const FeatureTitleWithInfo = ({
    additionalContainerClasses,
    breadCrumbs = [],
    children,
    iconClassName = 'icon-dim-20 fcn-6',
    title,
    renderDescriptionContent,
    closeModalText,
    docLink,
    SVGImage,
    showInfoIconTippy,
    docLinkText = 'View Documentation',
    dataTestId = 'feature-title-with-info',
    additionalContent,
    showInfoIcon = false,
    tabsConfig,
    isEnterprise,
}: DescriptorProps) => {
    const [showFeatureDescriptionModal, setShowFeatureDescriptionModal] = useState(false)
    const onClickInfoIcon = () => {
        setShowFeatureDescriptionModal(true)
    }

    const closeModal = () => {
        setShowFeatureDescriptionModal(false)
    }

    const renderTitle = () => {
        if (showInfoIconTippy) {
            return (
                <div className="flex left fs-16 cn-9 fw-6 dc__gap-4">
                    <span data-testid={dataTestId} className="lh-32">
                        {title}
                    </span>
                    <InfoIconTippy
                        heading={title}
                        infoText={renderDescriptionContent()}
                        additionalContent={additionalContent}
                        iconClassName={iconClassName}
                        documentationLink={docLink}
                        documentationLinkText={docLinkText}
                        dataTestid="info-tippy-button"
                        isEnterprise={isEnterprise}
                    />
                </div>
            )
        }
        if (breadCrumbs?.length > 0 || showInfoIcon) {
            return (
                <div className="flexbox dc__align-items-center dc__gap-4">
                    {showInfoIcon && breadCrumbs?.length === 0 ? (
                        <span className="fs-16 fw-6 cn-9 lh-32">{title}</span>
                    ) : (
                        <BreadCrumb breadcrumbs={breadCrumbs} />
                    )}
                    <ICHelpOutline className={`${iconClassName} icon-dim-20 cursor fcn-6`} onClick={onClickInfoIcon} />
                </div>
            )
        }

        return <span className="fs-16 fw-6 cn-9 lh-32">{title}</span>
    }

    return (
        <>
            <div
                className={`feature-description flexbox dc__content-space dc__align-items-center ${additionalContainerClasses ?? ''}`}
            >
                {renderTitle()}
                {children}
            </div>
            {showFeatureDescriptionModal && (
                <FeatureDescriptionModal
                    title={title}
                    closeModal={closeModal}
                    isEnterprise={isEnterprise}
                    closeModalText={closeModalText}
                    {...(Array.isArray(tabsConfig)
                        ? {
                              tabsConfig,
                          }
                        : {
                              renderDescriptionContent,
                              docLink,
                              SVGImage,
                          })}
                />
            )}
        </>
    )
}

export default FeatureTitleWithInfo
