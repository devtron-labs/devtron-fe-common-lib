import { UseActionMenuProps } from './types'

export const getActionMenuFlatOptions = <T extends string | number>(options: UseActionMenuProps<T>['options']) =>
    options.flatMap(
        (option, sectionIndex) =>
            option.items.map((groupOption, itemIndex) => ({
                option: groupOption,
                itemIndex,
                sectionIndex,
            })),
        [],
    )

const normalize = (str: string) => str.toLowerCase()

const fuzzyMatch = (text: string, term: string) => normalize(text).includes(term)

export const filterActionMenuOptions = <T extends string | number>(
    options: UseActionMenuProps<T>['options'],
    searchTerm: string,
) => {
    if (!searchTerm) {
        return options
    }

    const target = normalize(searchTerm)

    return options
        .map((option) => {
            const filteredItems = option.items.filter((item) => fuzzyMatch(item.label, target))
            return filteredItems.length > 0 ? { ...option, items: filteredItems } : null
        })
        .filter(Boolean)
}
