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

import { Link } from 'react-router-dom'
import { InfoColourBarType } from '../Types'
import { Tooltip } from '@Common/Tooltip'
import { Button } from '@Shared/Components'
import './infoColourBar.scss'

/**
 * @deprecated Use InfoBlock instead
 */
const InfoColourBar = ({
    message,
    classname,
    Icon,
    iconClass,
    iconSize,
    renderActionButton,
    linkText,
    redirectLink,
    linkOnClick,
    linkClass,
    internalLink,
    styles,
    hideIcon = false,
    textConfig,
}: InfoColourBarType) => {
    const renderLink = () => {
        if (!linkText) {
            return null
        }
        if (redirectLink) {
            if (internalLink) {
                return (
                    <Link
                        to={redirectLink}
                        onClick={linkOnClick}
                        data-testid="info-bar-internal-link"
                        className="cursor dc__link dc__underline-onhover mr-5"
                    >
                        {linkText}
                    </Link>
                )
            }

            return (
                <a
                    href={redirectLink}
                    target="_blank"
                    onClick={linkOnClick}
                    data-testid="info-bar-redirectLink"
                    className="cursor dc__link dc__underline-onhover mr-5"
                    rel="noreferrer"
                >
                    {linkText}
                </a>
            )
        }

        return (
            linkOnClick && (
                <div
                    onClick={linkOnClick}
                    className="cursor dc__link dc__underline-onhover"
                    data-testid="info-bar-linkText"
                >
                    {linkText}
                </div>
            )
        )
    }

    const renderMessageWrapper = () => {
        if (textConfig) {
            const { heading, description, actionButtonConfig } = textConfig

            return (
                <div className="flexbox flex-grow-1 dc__content-space dc__align-start">
                    <div className="flexbox-col">
                        {heading && <h6 className="m-0 cn-9 fs-13 fw-6 lh-20 dc__truncate">{heading}</h6>}

                        <Tooltip content={description}>
                            <p className="dc__truncate--clamp-3 m-0 cn-9 fs-13 fw-4 lh-20">{description}</p>
                        </Tooltip>
                    </div>

                    {actionButtonConfig && (
                        <Button
                            {...actionButtonConfig}
                        />
                    )}
                </div>
            )
        }

        return (
            <div className={`info-bar-message-wrapper ${linkClass || ''}`}>
                <span className={linkText && redirectLink ? 'mr-5' : ''}>{message}</span>
                {renderLink()}
            </div>
        )
    }

    return (
        <div className="info-bar-container">
            <div
                className={`${classname} info_text flex dc__content-space pt-8 pb-8 pl-12 pr-12 br-4 top fs-13 fw-4`}
                style={styles}
            >
                <div className={`flex top ${typeof renderActionButton === 'function' ? 'mr-5' : ''} ${!!textConfig ? 'flex-grow-1' : ''}`}>
                    {!hideIcon && (
                        <div className={`icon-dim-${iconSize ?? '20'} mr-10`}>
                            <Icon className={`icon-dim-${iconSize ?? '20'} ${iconClass || ''} mr-8`} />
                        </div>
                    )}
                    {renderMessageWrapper()}
                </div>
                {typeof renderActionButton === 'function' && renderActionButton()}
            </div>
        </div>
    )
}

export default InfoColourBar
