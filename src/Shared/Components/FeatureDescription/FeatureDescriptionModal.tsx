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

import { ComponentSizeType } from '@Shared/constants'

import { SegmentedControl, stopPropagation, VisibleModal } from '../../../Common'
import { Button, ButtonVariantType } from '../Button'
import { DocLink } from '../DocLink'
import { BUTTON_TEXT } from './constant'
import { FeatureDescriptionModalProps } from './types'
import { getImageSize } from './utils'

import './featureDescription.scss'

const FeatureDescriptionModalContent = ({
    renderDescriptionContent,
    closeModalText = BUTTON_TEXT.GOT_IT,
    docLink,
    closeModal,
    imageVariant,
    SVGImage,
    imageStyles = {},
}: Required<Omit<FeatureDescriptionModalProps, 'tabsConfig' | 'title'>>) => {
    const renderImage = () => {
        if (!SVGImage) {
            return null
        }
        return (
            <div className="flexbox dc__align-center dc__justify-center mb-12">
                <SVGImage
                    style={{
                        ...imageStyles,
                        width: `${getImageSize(imageVariant).width}`,
                        height: `${getImageSize(imageVariant).height}`,
                    }}
                />
            </div>
        )
    }
    const renderDescriptionBody = () => (
        <div className="pl-20 pr-20 pb-16 dc__gap-16">
            {renderImage()}
            {typeof renderDescriptionContent === 'function' && renderDescriptionContent()}
        </div>
    )

    const renderFooter = () => (
        <div
            className={`flex right w-100 dc__align-right dc__border-top-n1 px-20 py-16 ${docLink ? 'dc__content-space' : 'right'}`}
        >
            {docLink.length > 0 && (
                <DocLink
                    docLinkKey={docLink}
                    text={BUTTON_TEXT.VIEW_DOCUMENTATION}
                    dataTestId="feature-desc__view-doc"
                    showExternalIcon
                    variant={ButtonVariantType.secondary}
                    onClick={closeModal}
                />
            )}
            <Button
                text={closeModalText}
                dataTestId="feature-desc__got-it"
                size={ComponentSizeType.medium}
                onClick={closeModal}
            />
        </div>
    )

    return (
        <>
            {renderDescriptionBody()}
            {renderFooter()}
        </>
    )
}

export const FeatureDescriptionModal = ({
    title,
    renderDescriptionContent,
    closeModalText = BUTTON_TEXT.GOT_IT,
    docLink,
    closeModal,
    imageVariant,
    SVGImage,
    imageStyles = {},
    tabsConfig,
}: FeatureDescriptionModalProps) => {
    const [selectedTabId, setSelectedTabId] = useState(tabsConfig?.[0]?.id ?? null)
    const selectedTab = tabsConfig?.find((tab) => tab.id === selectedTabId) ?? null

    const handleSegmentSelectedTabChange = (selectedSegment) => {
        setSelectedTabId(selectedSegment.value)
    }

    return (
        <VisibleModal className="" close={closeModal}>
            <div
                className="feature-description modal__body w-600 mt-40 flex column p-0 fs-13 dc__overflow-hidden"
                onClick={stopPropagation}
            >
                <div className="flex left w-100 fs-16 fw-6 px-20 py-16">{title}</div>
                {Array.isArray(tabsConfig) ? (
                    selectedTab &&
                    tabsConfig.length > 0 && (
                        <>
                            <div className="px-20 pb-8 flex left w-100">
                                <SegmentedControl
                                    segments={tabsConfig.map((tab) => ({ label: tab.title, value: tab.id }))}
                                    value={selectedTabId}
                                    onChange={handleSegmentSelectedTabChange}
                                    name="feature-description-modal-tabs"
                                />
                            </div>
                            <FeatureDescriptionModalContent
                                SVGImage={selectedTab.SVGImage}
                                docLink={selectedTab.docLink}
                                imageStyles={selectedTab.imageStyles}
                                imageVariant={selectedTab.imageVariant}
                                renderDescriptionContent={selectedTab.renderDescriptionContent}
                                closeModal={closeModal}
                                closeModalText={closeModalText}
                            />
                        </>
                    )
                ) : (
                    <FeatureDescriptionModalContent
                        SVGImage={SVGImage}
                        closeModal={closeModal}
                        closeModalText={closeModalText}
                        docLink={docLink}
                        imageStyles={imageStyles}
                        imageVariant={imageVariant}
                        renderDescriptionContent={renderDescriptionContent}
                    />
                )}
            </div>
        </VisibleModal>
    )
}
