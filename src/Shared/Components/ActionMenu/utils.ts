/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
