import { Children, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { ChipProps } from './types'
import { getFontSize, getIconSize, getRemoveButtonSize, getVerticalPadding } from './utils'

import './styles.scss'

const ChipWrapper = ({
    children,
    type,
    style,
    onClick,
    href,
    size,
}: PropsWithChildren<Required<Pick<ChipProps, 'type' | 'style' | 'onClick' | 'href' | 'size'>>>) => {
    const baseClassName = `flexbox chip dc__w-fit-content br-4 ${style === 'error' ? 'chip--error' : 'border__primary'} bg__primary dc__transition--background dc__user-select-none dc__overflow-hidden dc__mxw-250 ${`chip--${size} dc__align-items-center`}`

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
    size = ComponentSizeType.xs,
    value,
    onRemove,
    style = 'neutral',
    type = 'non-interactive',
    onClick,
    href,
}: ChipProps) => {
    const iconSize = getIconSize(size)
    const verticalPadding = getVerticalPadding(size)
    const fontSize = getFontSize(size)

    const renderLabel = (isOnlyLabel = true) => (
        <div className={`flex dc__gap-4 px-6 ${verticalPadding}`}>
            {style === 'error' && isOnlyLabel && <Icon name="ic-error" color="R500" size={iconSize} />}

            {(style === 'neutral' || (style === 'error' && !isOnlyLabel)) && startIconProps && (
                <Icon {...{ ...startIconProps, size: iconSize }} />
            )}

            <span className={`${fontSize} lh-1-5 cn-9 fw-6 dc__open-sans ${isOnlyLabel ? 'dc__truncate' : ''}`}>
                {label}
            </span>
        </div>
    )

    const renderContent = () => (
        // NOTE: always render label and value in a fragment or an element to ensure consistent structure
        <>
            {renderLabel(!value)}

            {value && (
                <div className={`px-6 flex border__secondary--left dc__gap-4 ${verticalPadding}`}>
                    {style === 'error' && <Icon name="ic-error" color="R500" size={iconSize} />}

                    <span className={`${fontSize} lh-1-5 cn-9 fw-4 dc__open-sans dc__truncate`}>{value}</span>
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
                    size={getRemoveButtonSize(size)}
                    onClick={onRemoveClick}
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
                    size={getRemoveButtonSize(size)}
                />
            )}
        </ChipWrapper>
    )
}

export default Chip
