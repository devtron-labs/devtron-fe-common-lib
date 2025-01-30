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
import { ToastProps } from './types'

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
