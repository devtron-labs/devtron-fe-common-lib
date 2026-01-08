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

import { MouseEvent, ReactNode } from 'react'

import { DTFocusTrapType } from '../DTFocusTrap'

export interface BackdropProps
    extends Pick<
        DTFocusTrapType,
        'deactivateFocusOnEscape' | 'initialFocus' | 'onEscape' | 'returnFocusOnDeactivate' | 'avoidFocusTrap'
    > {
    /**
     * The content to be rendered within the backdrop component.
     */
    children: ReactNode
    /**
     * Callback function that gets triggered when the backdrop is clicked.
     * Useful for dismissing modals or other overlay content.
     * @param e - The mouse event object from the click interaction
     */
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
    /**
     * Determines if the backdrop should be transparent.
     * When true, the backdrop will not have any background color or blur filter.
     * @default false
     */
    hasClearBackground?: boolean
    /**
     * Callback function that gets triggered when the backdrop component mounts or unmounts.
     * This can be used to perform side effects or state updates when the backdrop's visibility changes.
     * @param isMounted - A boolean indicating whether the backdrop is currently mounted (true) or not (false)
     */
    onBackdropMount?: (isMounted: boolean) => void
}
