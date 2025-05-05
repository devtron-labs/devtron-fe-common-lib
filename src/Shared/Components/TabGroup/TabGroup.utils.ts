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

import { ComponentSizeType } from '@Shared/constants'

import { IconsProps } from '../Icon'
import { TabGroupProps } from './TabGroup.types'

export const getClassNameBySizeMap = ({
    hideTopPadding,
    isTabActive,
}: Pick<TabGroupProps, 'hideTopPadding'> & { isTabActive: boolean }): Record<
    TabGroupProps['size'],
    {
        tabClassName: string
        iconClassName: string
        badgeClassName: string
    }
> => ({
    [ComponentSizeType.medium]: {
        tabClassName: `fs-12 ${!hideTopPadding ? 'pt-6' : ''} ${isTabActive ? 'pb-3' : 'pb-5'}`,
        iconClassName: 'icon-dim-14',
        badgeClassName: 'fs-11 lh-18 tab-group__tab__badge--medium',
    },
    [ComponentSizeType.large]: {
        tabClassName: `fs-13 ${!hideTopPadding ? 'pt-8' : ''} ${isTabActive ? 'pb-5' : 'pb-7'}`,
        iconClassName: 'icon-dim-16',
        badgeClassName: 'fs-12 lh-20',
    },
    [ComponentSizeType.xl]: {
        tabClassName: `min-w-200 fs-13 ${!hideTopPadding ? 'pt-10' : ''} ${isTabActive ? 'pb-7' : 'pb-9'}`,
        iconClassName: 'icon-dim-16',
        badgeClassName: 'fs-12 lh-20',
    },
})

export const TAB_ICON_SIZE_MAP: Record<TabGroupProps['size'], IconsProps['size']> = {
    [ComponentSizeType.medium]: 14,
    [ComponentSizeType.large]: 16,
    [ComponentSizeType.xl]: 16,
}

export const tabGroupClassMap: Record<TabGroupProps['size'], string> = {
    [ComponentSizeType.medium]: 'dc__gap-12',
    [ComponentSizeType.large]: 'dc__gap-16',
    [ComponentSizeType.xl]: 'dc__gap-16',
}
