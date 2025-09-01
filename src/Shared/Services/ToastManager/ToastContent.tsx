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

import { Button, ButtonStyleType, ButtonVariantType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

import { ShortcutToastContentProps, ToastProps } from './types'

export const ToastContent = ({
    title,
    description,
    buttonProps,
}: Pick<ToastProps, 'title' | 'description' | 'buttonProps'>) => (
    <div className="flexbox-col dc__gap-8 custom-toast__content">
        <div className="flexbox-col dc__gap-4">
            <h3 className="m-0 fs-13 fw-6 lh-20 text__white dc__ellipsis-right__2nd-line">{title}</h3>
            <p className="fs-12 fw-4 lh-18 m-0 dc__truncate--clamp-6">{description}</p>
        </div>
        {buttonProps && (
            <Button
                {...buttonProps}
                variant={ButtonVariantType.text}
                size={ComponentSizeType.small}
                style={ButtonStyleType.neutral}
            />
        )}
    </div>
)

export const ShortcutToastContent = ({ shortcuts, text }: ShortcutToastContentProps) => (
    <div className="p-12 br-12 dc__border ev-5 bcv-1 flex dc__gap-6 dc__w-fit-content">
        {shortcuts.map((shortcutKey) => (
            <kbd
                key={shortcutKey}
                className="flex bg__primary border__primary br-2 shadow__key fs-13 lh-14 fw-5 cn-8 icon-dim-20 dc__no-shrink"
            >
                {shortcutKey}
            </kbd>
        ))}
        <span className="cn-9 fw-5 lh-20 fs-13 font-ibm-plex-sans">{text}</span>
    </div>
)
