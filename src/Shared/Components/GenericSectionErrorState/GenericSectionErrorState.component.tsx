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

import { ReactNode } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { Progressing } from '@Common/Progressing'
import { ReactComponent as ErrorIcon } from '@Icons/ic-error-exclamation.svg'
import { ReactComponent as ICInfoOutline } from '@Icons/ic-info-outline.svg'
import { ReactComponent as ICArrowCounterClockwise } from '@Icons/ic-arrow-counter-clockwise.svg'
import { Button, ButtonVariantType } from '../Button'
import { GenericSectionErrorStateProps } from './types'

const GenericSectionErrorState = ({
    reload,
    withBorder = false,
    title = 'Failed to load',
    subTitle = 'We could not load the information on this page.',
    description = 'Please reload or try again later',
    buttonText = 'Reload',
    rootClassName,
    useInfoIcon = false,
    progressingProps,
}: GenericSectionErrorStateProps) => {
    const renderMarker = () => {
        if (progressingProps) {
            return <Progressing {...progressingProps} />
        }

        if (useInfoIcon) {
            return <ICInfoOutline className="icon-dim-24" />
        }

        return <ErrorIcon className="icon-dim-24 alert-icon-r5-imp" />
    }

    const renderSubHeading = (content: ReactNode) => {
        if (!content) {
            return null
        }

        if (typeof content === 'string') {
            return <p className="m-0 dc__truncate--clamp-6">{content}</p>
        }

        return content
    }

    return (
        <div className={`flex column dc__gap-8 p-16 ${withBorder ? 'dc__border br-4' : ''} ${rootClassName || ''}`}>
            {renderMarker()}

            <div className="flex column dc__gap-4 dc__align-center">
                <h3 className="fs-13 lh-20 fw-6 cn-9 m-0">{title}</h3>
                {(subTitle || description) && (
                    <div className="flex column fs-13 lh-20 fw-4 cn-7">
                        {renderSubHeading(subTitle)}
                        {renderSubHeading(description)}
                    </div>
                )}
            </div>

            {reload && (
                <Button
                    startIcon={<ICArrowCounterClockwise className="dc__flip" />}
                    text={buttonText}
                    onClick={reload}
                    variant={ButtonVariantType.text}
                    size={ComponentSizeType.small}
                    dataTestId="generic-section-reload-button"
                />
            )}
        </div>
    )
}

export default GenericSectionErrorState
