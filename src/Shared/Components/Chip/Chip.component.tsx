import { Children } from 'react'
import { Link } from 'react-router-dom'

import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { ChipProps, ChipWrapperProps } from './types'
import { getFontSize, getIconSize, getPadding, getSupportedChipSizes } from './utils'

import './styles.scss'

const ChipWrapper = ({ children, type, style, onClick, href, size }: ChipWrapperProps) => {
    const baseClassName = `flexbox chip dc__w-fit-content br-4 ${style === 'error' ? 'chip--error' : 'border__primary'} bg__primary dc__transition--background dc__user-select-none dc__overflow-hidden dc__mxw-250 ${`chip--${size}`}`

    if (type === 'button') {
        const childrenArray = Children.toArray(children)
        const content = childrenArray[0]

        return (
            <div className={`${baseClassName} chip--button`}>
                <button onClick={onClick} className="p-0 m-0 flex dc__transparent" type="button">
                    {content}
                </button>

                {...childrenArray.slice(1)}
            </div>
        )
    }

    if (type === 'link') {
        return (
            <Link to={href} className={`${baseClassName} chip--link dc__no-decor`}>
                {children}
            </Link>
        )
    }

    return <div className={baseClassName}>{children}</div>
}

const Chip = ({
    label,
    startIconProps,
    startIcon,
    size: userSize = ComponentSizeType.xs,
    value,
    onRemove,
    style = 'neutral',
    type = 'non-interactive',
    onClick,
    capitalizeLabel = false,
    href,
}: ChipProps) => {
    const size = getSupportedChipSizes(userSize)
    const iconSize = getIconSize(size)
    const padding = getPadding(size)
    const fontSize = getFontSize(size)

    const renderIcon = () => {
        if (startIconProps) {
            return <Icon {...{ ...startIconProps, size: iconSize }} />
        }

        return startIcon ?? null
    }

    const renderLabel = (isOnlyLabel = true) => (
        <div className={`flex dc__gap-4 ${padding} dc__no-shrink dc__mxw-120`}>
            {style === 'error' && isOnlyLabel && <Icon name="ic-error" color="R500" size={iconSize} />}

            {(style === 'neutral' || (style === 'error' && !isOnlyLabel)) && renderIcon()}

            <Tooltip content={label}>
                <span
                    className={`${fontSize} ${capitalizeLabel ? 'dc__capitalize' : ''} cn-9 ${!isOnlyLabel ? 'fw-6' : 'fw-4'} dc__open-sans dc__truncate`}
                >
                    {label}
                </span>
            </Tooltip>
        </div>
    )

    const renderContent = () => (
        // NOTE: always render label and value in a fragment or an element to ensure consistent structure
        <>
            {renderLabel(!value)}

            {value && (
                <div className={`flex border__secondary--left dc__gap-4 ${padding}`}>
                    {style === 'error' && <Icon name="ic-error" color="R500" size={iconSize} />}

                    <Tooltip content={value}>
                        <span className={`${fontSize} cn-9 fw-4 dc__open-sans dc__truncate`}>{value}</span>
                    </Tooltip>
                </div>
            )}
        </>
    )

    const onRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onRemove(event)
    }

    return (
        <ChipWrapper style={style} type={type} onClick={onClick} href={href} size={size}>
            {renderContent()}

            {onRemove && (
                <Button
                    variant={ButtonVariantType.borderLess}
                    style={ButtonStyleType.negativeGrey}
                    dataTestId="chip__remove-btn"
                    showAriaLabelInTippy={false}
                    ariaLabel="Remove filter"
                    icon={<Icon name="ic-close-small" color={null} />}
                    size={size}
                    onClick={onRemoveClick}
                    buttonProps={{
                        onMouseDown: (e) => {
                            // NOTE: in react-select when using as MultiValue component, need to stop propagation
                            // to prevent the select from toggling the menu state
                            e.preventDefault()
                            e.stopPropagation()
                        },
                    }}
                />
            )}

            {type === 'link' && (
                <Button
                    component={ButtonComponentType.link}
                    linkProps={{ to: href }}
                    variant={ButtonVariantType.borderLess}
                    style={ButtonStyleType.neutral}
                    dataTestId="chip__visit-link"
                    showAriaLabelInTippy={false}
                    ariaLabel="Visit link"
                    icon={<Icon name="ic-arrow-square-out" color={null} />}
                    size={size}
                />
            )}
        </ChipWrapper>
    )
}

export default Chip
