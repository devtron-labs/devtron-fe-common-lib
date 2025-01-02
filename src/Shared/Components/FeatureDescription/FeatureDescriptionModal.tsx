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

import { ChangeEvent, useState } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { StyledRadioGroup, VisibleModal, stopPropagation } from '../../../Common'
import { BUTTON_TEXT } from './constant'
import { FeatureDescriptionModalProps } from './types'
import './featureDescription.scss'
import { ReactComponent as ArrowOutSquare } from '../../../Assets/Icon/ic-arrow-square-out.svg'
import { getImageSize } from './utils'
import { Button } from '../Button'

const FeatureDescriptionModalContent = ({
    renderDescriptionContent,
    closeModalText = BUTTON_TEXT.GOT_IT,
    docLink = '',
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
                <a
                    className="flex dc__link en-2 bw-1 dc__gap-6 br-4 fw-6 lh-20 px-8 py-6 h-32 anchor dc__hover-n50"
                    href={docLink}
                    target="_blank"
                    rel="noreferrer"
                >
                    {BUTTON_TEXT.VIEW_DOCUMENTATION}
                    <ArrowOutSquare className="icon-dim-16 scb-5" />
                </a>
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
    docLink = '',
    closeModal,
    imageVariant,
    SVGImage,
    imageStyles = {},
    tabsConfig,
}: FeatureDescriptionModalProps) => {
    const [selectedTabId, setSelectedTabId] = useState(tabsConfig?.[0]?.id ?? null)
    const selectedTab = tabsConfig?.find((tab) => tab.id === selectedTabId) ?? null

    const handleSelectedTabChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedTabId(e.target.value)
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
                                <StyledRadioGroup
                                    className="gui-yaml-switch"
                                    name="feature-description-modal-tabs"
                                    initialTab={selectedTab.id}
                                    disabled={false}
                                    onChange={handleSelectedTabChange}
                                >
                                    {tabsConfig.map((tab) => (
                                        <StyledRadioGroup.Radio value={tab.id} key={tab.id}>
                                            {tab.title}
                                        </StyledRadioGroup.Radio>
                                    ))}
                                </StyledRadioGroup>
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
