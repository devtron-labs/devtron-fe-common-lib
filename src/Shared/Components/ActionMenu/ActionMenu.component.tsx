import { MutableRefObject } from 'react'

import { CustomInput } from '../CustomInput'
import { Popover } from '../Popover'
import { SelectPickerMenuListFooter } from '../SelectPicker/common'
import { ActionMenuItem } from './ActionMenuItem'
import { ActionMenuItemType, ActionMenuProps } from './types'
import { useActionMenu } from './useActionMenu.hook'

import './actionMenu.scss'

export const ActionMenu = <T extends string | number = string | number>({
    id,
    options,
    onClick,
    position,
    alignment,
    width,
    isSearchable,
    disableDescriptionEllipsis,
    buttonProps,
    children,
    onOpen,
    footerConfig,
}: ActionMenuProps<T>) => {
    // HOOKS
    const {
        open,
        filteredOptions,
        flatOptions,
        triggerProps,
        overlayProps,
        popoverProps,
        focusedIndex,
        searchTerm,
        handleSearch,
        itemsRef,
        setFocusedIndex,
        closePopover,
        scrollableRef,
    } = useActionMenu({
        id,
        options,
        position,
        alignment,
        width,
        isSearchable,
        onOpen,
    })

    // HANDLERS
    const handleOptionMouseEnter = (index: number) => () => setFocusedIndex(index)

    const handleOptionOnClick = (item: ActionMenuItemType<T>) => () => {
        onClick(item)
        closePopover()
    }

    return (
        <Popover
            open={open}
            overlayProps={overlayProps}
            popoverProps={popoverProps}
            triggerProps={triggerProps}
            buttonProps={buttonProps}
            triggerElement={children}
        >
            <div className="flexbox-col mxh-300">
                {isSearchable && (
                    <div
                        role="search"
                        className="action-menu__searchbox bg__primary px-12 py-8 border__secondary--bottom"
                    >
                        <CustomInput
                            name="action-menu-search-box"
                            value={searchTerm}
                            placeholder="Search"
                            onChange={handleSearch}
                            fullWidth
                        />
                    </div>
                )}
                <ul
                    ref={scrollableRef as MutableRefObject<HTMLUListElement>}
                    role="menu"
                    className="action-menu m-0 p-0 flex-grow-1 dc__overflow-auto dc__overscroll-none"
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, sectionIndex) => (
                            <li
                                key={option.groupLabel || `no-group-label-${sectionIndex}`}
                                role="menuitem"
                                className="action-menu__group flexbox-col dc__gap-4 py-4"
                            >
                                {option.groupLabel && (
                                    <h4 className="bg__menu--secondary dc__truncate m-0 fs-12 lh-18 cn-9 fw-6 py-4 px-12 dc__position-sticky dc__top-0 dc__zi-1">
                                        {option.groupLabel}
                                    </h4>
                                )}
                                {option.items.length > 0 ? (
                                    <ul className="action-menu__group-list p-0">
                                        {option.items.map((item, itemIndex) => {
                                            const index = flatOptions.findIndex(
                                                (flatOption) =>
                                                    flatOption.sectionIndex === sectionIndex &&
                                                    flatOption.itemIndex === itemIndex,
                                            )

                                            return (
                                                <ActionMenuItem<T>
                                                    key={`${item.label}-${item.id}`}
                                                    item={item}
                                                    itemRef={itemsRef.current[index]}
                                                    isFocused={index === focusedIndex}
                                                    onMouseEnter={handleOptionMouseEnter(index)}
                                                    onClick={handleOptionOnClick(item)}
                                                    disableDescriptionEllipsis={disableDescriptionEllipsis}
                                                />
                                            )
                                        })}
                                    </ul>
                                ) : (
                                    <p className="m-0 fs-13 lh-18 fw-4 cn-7 py-6 px-12">No options in this group</p>
                                )}
                            </li>
                        ))
                    ) : (
                        <li role="menuitem" className="border__secondary--top py-8 px-12">
                            <p className="m-0 fs-13 lh-20 fw-4 cn-7">No options</p>
                        </li>
                    )}
                </ul>
                {footerConfig && (
                    <div className="bg__menu--secondary border__secondary--top">
                        <SelectPickerMenuListFooter menuListFooterConfig={footerConfig} />
                    </div>
                )}
            </div>
        </Popover>
    )
}
