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

import { cloneElement } from 'react'
import { Link } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'

import { Icon as IconComponent } from '../Icon'
import { GenericInfoCardProps } from './types'
import { getClassNameForBorderVariant } from './utils'

import './styles.scss'

const GenericInfoCard = ({
    title,
    description,
    author,
    isLoading,
    borderVariant,
    Icon,
    onClick,
    linkProps,
}: GenericInfoCardProps) => {
    const IconElement = isLoading ? <div className="shimmer" /> : Icon

    const renderShimmerContent = () => (
        <>
            <div className="icon-dim-40 dc__no-shrink br-6">
                <div className="shimmer shimmer__fill-dimensions" />
            </div>

            <div className="flexbox-col dc__gap-8 flex-grow-1">
                <div className="flexbox-col dc__gap-4">
                    <span className={isLoading ? 'shimmer w-300' : ''} />
                    <span className={isLoading ? 'shimmer w-150 pt-2' : ''} />
                </div>

                <span className={isLoading ? 'shimmer w-600' : ''} />
            </div>
        </>
    )

    const renderContent = () => (
        <div
            className={`flexbox dc__gap-16 p-12 bg__primary generic-info-card br-8 ${getClassNameForBorderVariant(borderVariant)}`}
        >
            {isLoading ? (
                renderShimmerContent()
            ) : (
                <>
                    {cloneElement(IconElement, {
                        className: `${IconElement.props?.className ?? ''} icon-dim-40 dc__no-shrink br-6 dc__fill-available-space`,
                    })}

                    <div className="flexbox-col dc__gap-8 flex-grow-1">
                        <div className="flexbox-col">
                            <div className="flexbox dc__align-items-center">
                                <Tooltip content={title}>
                                    <h3 className="fw-6 fs-13 lh-20 cn-9 m-0 generic-info-card__title dc__truncate dc__mxw-600">
                                        {title}
                                    </h3>
                                </Tooltip>

                                <div className="generic-info-card__arrow dc__no-shrink flex">
                                    <IconComponent color="B500" name="ic-caret-down-small" rotateBy={270} />
                                </div>
                            </div>

                            <Tooltip content={author}>
                                <h4 className="fw-4 fs-12 lh-16 cn-7 m-0 dc__truncate w-300">By {author}</h4>
                            </Tooltip>
                        </div>

                        {description && (
                            <p className="fw-4 fs-12 lh-16 cn-7 m-0 dc__truncate--clamp-3">{description}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )

    if (!linkProps && !onClick) {
        return renderContent()
    }

    if (linkProps) {
        return <Link {...linkProps}>{renderContent()}</Link>
    }

    return (
        <div role="button" tabIndex={0} onClick={onClick} className="dc__unset-button-styles dc__align-unset">
            {renderContent()}
        </div>
    )
}

export default GenericInfoCard
