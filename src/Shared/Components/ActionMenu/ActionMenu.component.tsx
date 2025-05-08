import { Fragment } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { CustomInput } from '../CustomInput'
import { ActionMenuItem } from './ActionMenuItem'
import { ActionMenuItemType, ActionMenuProps } from './types'
import { useActionMenu } from './useActionMenu.hook'

import './actionMenu.scss'

export const ActionMenu = ({
    options,
    onClick,
    position,
    alignment,
    width,
    isSearchable,
    disableDescriptionEllipsis,
    children,
}: ActionMenuProps) => {
    // HOOKS
    const {
        open,
        filteredOptions,
        flatOptions,
        triggerProps,
        menuProps,
        focusedIndex,
        searchTerm,
        setFocusedIndex,
        closeMenu,
        handleSearch,
    } = useActionMenu({
        options,
        position,
        alignment,
        width,
        isSearchable,
        onClick,
    })

    // HANDLERS
    const handleOptionMouseEnter = (index: number) => () => setFocusedIndex(index)

    const handleOptionOnClick = (item: ActionMenuItemType) => () => {
        onClick(item)
        closeMenu()
    }

    // RENDERERS
    const renderOption = (item: ActionMenuItemType, sectionIndex: number, itemIndex: number) => {
        const index = flatOptions.findIndex(
            (flatOption) => flatOption.sectionIndex === sectionIndex && flatOption.itemIndex === itemIndex,
        )

        return (
            <ActionMenuItem
                key={item.value}
                item={item}
                isFocused={index === focusedIndex}
                onMouseEnter={handleOptionMouseEnter(index)}
                onClick={handleOptionOnClick(item)}
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
                        {isSearchable && (
                            <li role="menuitem" className="action-menu__searchbox px-12 py-8">
                                <CustomInput
                                    name="action-menu-search-box"
                                    value={searchTerm}
                                    placeholder="Search"
                                    onChange={handleSearch}
                                    fullWidth
                                />
                            </li>
                        )}
                        {filteredOptions.length ? (
                            filteredOptions.map((option, sectionIndex) => (
                                <li
                                    key={option.groupLabel}
                                    role="menuitem"
                                    className="action-menu__group flexbox-col dc__gap-4 py-4"
                                >
                                    {option.groupLabel && (
                                        <h4 className="bg__menu--secondary dc__truncate m-0 fs-12 lh-18 cn-9 fw-6 py-4 px-12 dc__position-sticky dc__top-0 dc__zi-1">
                                            {option.groupLabel}
                                        </h4>
                                    )}
                                    {option.items.length ? (
                                        <ul className="action-menu__group-list p-0">
                                            {option.items.map((item, itemIndex) => (
                                                <Fragment key={item.value}>
                                                    {renderOption(item, sectionIndex, itemIndex)}
                                                </Fragment>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="m-0 fs-13 lh-18 fw-4 cn-7 py-6 px-12">No options in group</p>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li role="menuitem" className="border__secondary--top py-8 px-12">
                                <p className="m-0 fs-13 lh-20 fw-4 cn-7">No options</p>
                            </li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
