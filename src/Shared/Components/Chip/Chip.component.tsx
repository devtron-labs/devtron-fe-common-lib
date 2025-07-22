import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { ChipProps } from './types'
import { getIconSize } from './utils'

import './styles.scss'

const Chip = ({
    label,
    startIconProps,
    size = ComponentSizeType.xs,
    value,
    onRemove,
    style = 'neutral',
}: ChipProps) => {
    const iconSize = getIconSize(size)

    const renderLabel = (isOnlyLabel = true) => (
        <div className="flex dc__gap-4 px-6">
            {style === 'error' && isOnlyLabel && <Icon name="ic-error" color="R500" size={iconSize} />}

            {style === 'neutral' && startIconProps && <Icon {...{ ...startIconProps, size: iconSize }} />}

            <span className={`fs-12 lh-20 cn-9 fw-6 dc__open-sans ${isOnlyLabel ? 'dc__truncate' : ''}`}>{label}</span>
        </div>
    )

    const renderContent = () => {
        if (value) {
            return (
                <>
                    {renderLabel(false)}

                    {value && (
                        <div className="px-6 flex border__secondary--left dc__gap-4">
                            {style === 'error' && <Icon name="ic-error" color="R500" size={iconSize} />}

                            <span className="fs-12 lh-20 cn-9 fw-4 dc__open-sans dc__truncate">{value}</span>
                        </div>
                    )}
                </>
            )
        }

        return renderLabel()
    }

    return (
        <div
            className={`flexbox chip br-4 ${style === 'error' ? 'chip__border--error' : 'border__primary'} bg__primary dc__user-select-none dc__overflow-hidden dc__mxw-250`}
        >
            {renderContent()}

            {onRemove && (
                <Button
                    variant={ButtonVariantType.borderLess}
                    style={ButtonStyleType.negativeGrey}
                    dataTestId="filter-chip__remove-btn"
                    showAriaLabelInTippy={false}
                    ariaLabel="Remove filter"
                    icon={<Icon name="ic-close-small" color={null} />}
                    size={ComponentSizeType.xs}
                    onClick={onRemove}
                />
            )}
        </div>
    )
}

export default Chip
