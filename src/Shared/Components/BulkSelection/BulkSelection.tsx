import BulkSelectionDropdownItems from './BulkSelectionDropdownItems'
import { CHECKBOX_VALUE, Checkbox, PopupMenu, noop } from '../../../Common'
import { BulkSelectionDropdownItemsType, BulkSelectionEvents, BulkSelectionProps } from './types'
import { BULK_DROPDOWN_TEST_ID, BulkSelectionOptionsLabels } from './constants'
import { ReactComponent as ICChevronDown } from '../../../Assets/Icon/ic-chevron-down.svg'
import { ReactComponent as ICCheckSquare } from '../../../Assets/Icon/ic-check-square.svg'
import { ReactComponent as ICCheckAll } from '../../../Assets/Icon/ic-check-all.svg'
import { ReactComponent as ICClose } from '../../../Assets/Icon/ic-close.svg'

const BulkSelection = <T,>({
    checkboxValue,
    isChecked,
    selectedIdentifiers,
    handleBulkSelection,
    showPagination,
}: BulkSelectionProps<T>) => {
    const areOptionsSelected = Object.keys(selectedIdentifiers).length > 0
    const BulkSelectionItems: BulkSelectionDropdownItemsType[] = [
        {
            locator: BulkSelectionEvents.SELECT_ALL_ON_PAGE,
            label: BulkSelectionOptionsLabels[BulkSelectionEvents.SELECT_ALL_ON_PAGE],
            isSelected: isChecked && checkboxValue === CHECKBOX_VALUE.CHECKED,
            icon: ICCheckSquare,
        },
        ...(showPagination
            ? [
                  {
                      locator: BulkSelectionEvents.SELECT_ALL_ACROSS_PAGES,
                      label: BulkSelectionOptionsLabels[BulkSelectionEvents.SELECT_ALL_ACROSS_PAGES],
                      isSelected: isChecked && checkboxValue === CHECKBOX_VALUE.BULK_CHECKED,
                      icon: ICCheckAll,
                  },
              ]
            : []),
        ...(areOptionsSelected
            ? [
                  {
                      locator: BulkSelectionEvents.CLEAR_ALL_SELECTIONS,
                      label: BulkSelectionOptionsLabels[BulkSelectionEvents.CLEAR_ALL_SELECTIONS],
                      isSelected: false,
                      icon: ICClose,
                  },
              ]
            : []),
    ]

    return (
        <PopupMenu autoClose>
            <PopupMenu.Button
                isKebab
                rootClassName="h-20 flexbox p-0 dc__no-background dc__no-border dc__outline-none-imp"
                dataTestId={BULK_DROPDOWN_TEST_ID}
            >
                <Checkbox
                    isChecked={isChecked}
                    onChange={noop}
                    rootClassName="icon-dim-20"
                    value={checkboxValue}
                    // Ideally should be disabled but was giving issue with cursor
                />

                <ICChevronDown className="icon-dim-20 icon-n6" />
            </PopupMenu.Button>

            <PopupMenu.Body rootClassName="dc__top-22 w-150 dc__right-0 pt-4 pb-4 pl-0 pr-0 bcn-0 flex column dc__content-start dc__align-start dc__position-abs bcn-0 dc__border dc__border-radius-4-imp">
                {BulkSelectionItems.map((item) => (
                    <BulkSelectionDropdownItems<T>
                        key={item.locator}
                        locator={item.locator}
                        label={item.label}
                        isSelected={item.isSelected}
                        icon={item.icon}
                        handleBulkSelection={handleBulkSelection}
                    />
                ))}
            </PopupMenu.Body>
        </PopupMenu>
    )
}

export default BulkSelection
