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

import React, { useEffect, useState, useRef } from 'react'
import { IconButtonProps } from '@rjsf/utils'

import { ConditionalWrap } from '../../../Helper'
import { getTippyWrapperWithContent } from '../../utils'
import { ReactComponent as PlusIcon } from '../../../../Assets/Icon/ic-add.svg'

export const AddButton = ({
    label,
    icon,
    iconType,
    registry,
    uiSchema,
    ...props
}: IconButtonProps & Partial<Record<'label', string>>) => {
    const [showTippy, setShowTippy] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const content = `Add ${label}`

    useEffect(() => setShowTippy(buttonRef.current?.offsetWidth >= 250), [buttonRef.current])

    return (
        <div className="flexbox flex-justify-start">
            <ConditionalWrap condition={showTippy} wrap={getTippyWrapperWithContent(content)}>
                <button
                    ref={buttonRef}
                    {...props}
                    type="button"
                    className="dc__outline-none-imp p-0 dc__transparent flex dc__gap-4 cursor dc__mxw-250"
                    title="Add"
                >
                    <PlusIcon className="icon-dim-16 fcb-5" />
                    <span className="cb-5 fs-13 lh-20 dc__truncate">{content}</span>
                </button>
            </ConditionalWrap>
        </div>
    )
}
