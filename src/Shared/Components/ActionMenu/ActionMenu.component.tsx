import PopupMenu from '@Common/PopupMenu'
import { Tooltip } from '@Common/Tooltip'
import { ActionMenuOptionProps, ActionMenuProps } from './types'
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
                className={`flex left dc__gap-8 ${description ? 'top' : ''} py-6 px-8 cursor dc__hover-n50`}
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

const ActionMenu = ({ options, disableDescriptionEllipsis, children, onClick }: ActionMenuProps) => (
    <PopupMenu autoClose>
        <PopupMenu.Button isKebab rootClassName="flex left dc__no-background">
            {children}
        </PopupMenu.Button>
        <PopupMenu.Body rootClassName="dc__border py-4 mxh-300 dc__overflow-auto">
            {options.length > 0
                ? options.map((groupOrOption) =>
                      'options' in groupOrOption ? (
                          <div className="pt-4">
                              <h4 className="fs-12 lh-18 cn-9 fw-6 py-4 px-8 dc__truncate bg__menu--secondary m-0 dc__top-0 dc__zi-1 dc__position-sticky">
                                  {groupOrOption.label}
                              </h4>
                              {groupOrOption.options.length > 0 ? (
                                  groupOrOption.options.map((option) => (
                                      <ActionMenuOption
                                          key={option.value}
                                          option={option}
                                          onClick={onClick}
                                          disableDescriptionEllipsis={disableDescriptionEllipsis}
                                      />
                                  ))
                              ) : (
                                  <p className="fs-12 lh-20 fw-4 lh-18 cn-7 m-0">No options in group</p>
                              )}
                          </div>
                      ) : (
                          <ActionMenuOption
                              key={groupOrOption.value}
                              option={groupOrOption}
                              onClick={onClick}
                              disableDescriptionEllipsis={disableDescriptionEllipsis}
                          />
                      ),
                  )
                : 'No Options'}
        </PopupMenu.Body>
    </PopupMenu>
)

export default ActionMenu
