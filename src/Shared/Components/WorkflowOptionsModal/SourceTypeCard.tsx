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

import { Fragment, ReactNode } from 'react'
import Tippy from '@tippyjs/react'

import { ConditionalWrap } from '@Common/Helper'

import { Icon } from '../Icon'
import { SourceTypeCardProps } from './types'

const renderTippy =
    ({ disableInfo }: Required<Pick<SourceTypeCardProps, 'disableInfo'>>) =>
    (children: ReactNode) => (
        <Tippy className="default-tt w-200" placement="top" content={disableInfo} arrow={false}>
            {/* Since in disabled state Tippy does'nt work */}
            <span>{children}</span>
        </Tippy>
    )

const SourceTypeCard = ({
    title,
    subtitle,
    dataTestId,
    icons,
    type,
    disableInfo,
    disabled = false,
    onCardAction,
}: SourceTypeCardProps) => {
    // CONSTANTS
    const isDisabled = !!disableInfo || disabled

    return (
        <ConditionalWrap wrap={renderTippy({ disableInfo })} condition={!!disableInfo}>
            <div
                role="button"
                aria-label={`source-type-card-${type}`}
                data-testid={dataTestId}
                data-pipeline-type={type}
                tabIndex={isDisabled ? -1 : 0}
                aria-disabled={isDisabled}
                className={`flexbox-col bg__primary br-8 border__secondary-translucent ${isDisabled ? 'dc__disabled' : ''} `}
                onClick={onCardAction}
                onKeyDown={onCardAction}
            >
                {!!icons.length && (
                    <div className="flex bg__tertiary br-6 px-12 py-16 m-4">
                        {icons.map(({ name, color }, index) => (
                            <Fragment key={name}>
                                <div className="flex p-8 br-8 bg__primary border__secondary-translucent">
                                    <Icon name={name} color={color} size={20} />
                                </div>
                                {index !== icons.length - 1 && (
                                    <div className="divider__secondary-translucent--horizontal w-16" />
                                )}
                            </Fragment>
                        ))}
                    </div>
                )}
                <div className="flexbox-col dc__gap-2 px-12 pt-4 pb-12">
                    <p className="m-0 fs-12 lh-18 fw-6 cn-9">{title}</p>
                    <p className="m-0 fs-11 lh-16 fw-4 cn-7">{subtitle}</p>
                </div>
            </div>
        </ConditionalWrap>
    )
}

export default SourceTypeCard
