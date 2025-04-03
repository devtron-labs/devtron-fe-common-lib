import { Tooltip } from '@Common/Tooltip'
import { ActionMenuOptionProps } from './types'
import { getTooltipProps } from '../SelectPicker/common'

const ActionMenuOption = ({ option, onClick, disableDescriptionEllipsis }: ActionMenuOptionProps) => {
    const iconBaseClass = 'dc__no-shrink icon-dim-16 flex dc__fill-available-space'
    const { description, label, startIcon, endIcon, tooltipProps } = option

    const handleClick = () => {
        onClick(option)
    }

    return (
        <Tooltip {...getTooltipProps(tooltipProps)}>
            <div
                // Intentionally added margin to the left and right to have the gap on the edges of the options
                className={`flex left dc__gap-8 ${description ? 'top' : ''} py-6 px-8 cursor dc__hover-n50 mr-4 ml-4 br-4 action-menu__option`}
                onClick={handleClick}
            >
                {startIcon && <div className={`${iconBaseClass} mt-2`}>{startIcon}</div>}
                <div className="flex-grow-1">
                    <Tooltip content={label} placement="right">
                        <h4 className="m-0 fs-13 cn-9 fw-4 lh-20 dc__truncate">{label}</h4>
                    </Tooltip>
                    {description &&
                        (typeof description === 'string' ? (
                            <p
                                className={`m-0 fs-12 fw-4 lh-18 cn-7 ${!disableDescriptionEllipsis ? 'dc__ellipsis-right__2nd-line' : 'dc__word-break'}`}
                            >
                                {description}
                            </p>
                        ) : (
                            <div className="fs-12 lh-18">{description}</div>
                        ))}
                </div>
                {endIcon && <div className={iconBaseClass}>{endIcon}</div>}
            </div>
        </Tooltip>
    )
}

export default ActionMenuOption
