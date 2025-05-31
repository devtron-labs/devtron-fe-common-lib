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

import { DTSwitch } from '../Switch'
import { ToggleResolveScopedVariablesProps } from './types'

const ToggleResolveScopedVariables = ({
    name,
    resolveScopedVariables,
    handleToggleScopedVariablesView,
    isDisabled = false,
    showTooltip = true,
}: ToggleResolveScopedVariablesProps) => {
    const ariaLabel = resolveScopedVariables ? 'Hide variables value' : 'Show variables value'

    return (
        <DTSwitch
            name={name}
            tooltipContent={showTooltip ? ariaLabel : ''}
            isChecked={resolveScopedVariables}
            ariaLabel={ariaLabel}
            onChange={handleToggleScopedVariablesView}
            iconName="ic-view-variable-toggle"
            isDisabled={isDisabled}
            shape="square"
            variant="theme"
        />
    )
}

export default ToggleResolveScopedVariables
