import { Fragment } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import ActionMenuOption from './ActionMenuOption'
import { ActionMenuOptionType, ActionMenuProps } from './types'
import { useActionMenu } from './useActionMenu.hook'

import './actionMenu.scss'

export const ActionMenu = ({
    options,
    onClick,
    position,
    alignment,
    width,
    disableDescriptionEllipsis,
    children,
}: ActionMenuProps) => {
    // HOOKS
    const { open, flatOptions, triggerProps, menuProps, focusedIndex, setFocusedIndex, closeMenu } = useActionMenu({
        options,
        onClick,
        position,
        alignment,
        width,
    })

    // HANDLERS
    const handleOptionMouseEnter = (index: number) => () => setFocusedIndex(index)

    const handleOptionOnClick = (option: ActionMenuOptionType) => () => {
        onClick(option)
        closeMenu()
    }

    // RENDERERS
    const renderOption = (option: ActionMenuOptionType, sectionIndex: number, itemIndex: number) => {
        const index = flatOptions.findIndex(
            (flatOption) => flatOption.sectionIndex === sectionIndex && flatOption.itemIndex === itemIndex,
        )

        return (
            <ActionMenuOption
                key={option.value}
                option={option}
                isFocused={index === focusedIndex}
                onMouseEnter={handleOptionMouseEnter(index)}
                onClick={handleOptionOnClick(option)}
                disableDescriptionEllipsis={disableDescriptionEllipsis}
            />
        )
    }

    return (
        <div className="dc__position-rel dc__inline-block">
            <div {...triggerProps}>{children}</div>

            <AnimatePresence>
                {open && (
                    <motion.ul {...menuProps}>
                        {options.map((groupOrOption, sectionIndex) => {
                            if ('options' in groupOrOption) {
                                return (
                                    <li
                                        key={groupOrOption.label}
                                        role="menuitem"
                                        className="action-menu__group flexbox-col dc__gap-4 py-4"
                                    >
                                        {groupOrOption.label && (
                                            <h4 className="action-menu__group-label bg__menu--secondary dc__truncate m-0 fs-12 lh-18 cn-9 fw-6 py-4 px-12 dc__position-sticky dc__zi-1">
                                                {groupOrOption.label}
                                            </h4>
                                        )}
                                        {groupOrOption.options.length > 0 ? (
                                            <ul className="action-menu__group-list p-0">
                                                {groupOrOption.options.map((option, itemIndex) => (
                                                    <Fragment key={option.value}>
                                                        {renderOption(option, sectionIndex, itemIndex)}
                                                    </Fragment>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="m-0 fs-13 lh-18 fw-4 lh-18 cn-7 py-6 px-12">
                                                No options in group
                                            </p>
                                        )}
                                    </li>
                                )
                            }

                            return (
                                <Fragment key={groupOrOption.value}>
                                    {renderOption(groupOrOption, sectionIndex, -1)}
                                </Fragment>
                            )
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
