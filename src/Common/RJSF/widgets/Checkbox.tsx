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

import { WidgetProps } from '@rjsf/utils'
import { isNullOrUndefined } from '@Shared/Helpers'
import { DTSwitch } from '@Shared/Components'

export const Checkbox = ({
    id,
    onChange,
    value,
    disabled,
    readonly,
    autofocus,
}: WidgetProps) => {
    const isSelected: boolean = isNullOrUndefined(value) ? false : value

    const handleChange = () => {
        onChange(!isSelected)
    }

    return (
        <div className="flexbox dc__align-items-center dc__gap-8">
            <DTSwitch
                name={id}
                ariaLabel={id}
                onChange={handleChange}
                isChecked={isSelected}
                autoFocus={autofocus}
                isDisabled={disabled || readonly}
            />
            <span className="dc__capitalize">{isSelected.toString()}</span>
        </div>
    )
}
