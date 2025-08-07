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

import { MouseEvent } from 'react'

import { ButtonComponentType, ButtonProps } from '@Shared/Components'

import { DOCUMENTATION } from './constants'

export type BaseDocLink<T extends boolean> = {
    isExternalLink?: T
    isEnterprise?: boolean
    isLicenseDashboard?: boolean
    docLinkKey: T extends true ? string : keyof typeof DOCUMENTATION
}

export type DocLinkProps<T extends boolean = false> = Pick<
    ButtonProps<ButtonComponentType.anchor>,
    'dataTestId' | 'size' | 'variant' | 'fullWidth' | 'fontWeight' | 'startIcon'
> &
    Omit<BaseDocLink<T>, 'isEnterprise'> & {
        text?: string
        showExternalIcon?: boolean
        onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
        /**
         * If `true`, the documentation will open in a new browser tab instead of the side panel.
         * @default false
         */
        openInNewTab?: boolean
    }

export interface URLWithUTMSource {
    isEnterprise: BaseDocLink<false>['isEnterprise']
    link?: string
}
