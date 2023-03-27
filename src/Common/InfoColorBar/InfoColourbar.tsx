import React from 'react'
import { Link } from 'react-router-dom'
import { InfoColourBarType } from '../Types'
import './infoColourBar.scss'

function InfoColourBar({
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
}: InfoColourBarType) {
    const renderLink = () => {
        if (!linkText) {
            return null
        } else if (redirectLink) {
            if (internalLink) {
                return (
                    <Link
                        to={redirectLink}
                        onClick={linkOnClick}
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
                    className="cursor dc__link dc__underline-onhover mr-5"
                >
                    {linkText}
                </a>
            )
        }

        return (
            linkOnClick && (
                <div onClick={linkOnClick} className="cursor dc__link dc__underline-onhover">
                    {linkText}
                </div>
            )
        )
    }

    return (
        <div className="info-bar-container">
            <div
                className={`${classname} info_text flex dc__content-space pt-8 pb-8 pl-12 pr-12 br-4 top fs-13 fw-4`}
                style={styles}
            >
                <div className={`flex top ${typeof renderActionButton === 'function' ? 'mr-5' : ''}`}>
                    <div className={`icon-dim-${iconSize ?? '20'} mr-10`}>
                        <Icon className={`icon-dim-${iconSize ?? '20'} ${iconClass || ''} mr-8`} />
                    </div>
                    <div className={`info-bar-message-wrapper ${linkClass || ''}`}>
                        <span className={linkText && redirectLink ? 'mr-5' : ''}>{message}</span>
                        {renderLink()}
                    </div>
                </div>
                {typeof renderActionButton === 'function' && renderActionButton()}
            </div>
        </div>
    )
}

export default InfoColourBar
