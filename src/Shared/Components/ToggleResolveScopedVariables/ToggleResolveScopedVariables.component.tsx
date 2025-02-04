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

import { Toggle, Tooltip } from '@Common/index'
import { ReactComponent as ICViewVariableToggle } from '@Icons/ic-view-variable-toggle.svg'
import { ToggleResolveScopedVariablesProps } from './types'

const ToggleResolveScopedVariables = ({
    resolveScopedVariables,
    handleToggleScopedVariablesView,
    isDisabled = false,
    showTooltip = true,
    throttleOnChange,
}: ToggleResolveScopedVariablesProps) => (
    <Tooltip
        alwaysShowTippyOnHover={showTooltip}
        content={resolveScopedVariables ? 'Hide variables value' : 'Show variables value'}
    >
        <div className="w-28 h-18">
            <Toggle
                selected={resolveScopedVariables}
                color={resolveScopedVariables ? 'var(--B300)' : 'var(--N200)'}
                onSelect={handleToggleScopedVariablesView}
                Icon={ICViewVariableToggle}
                disabled={isDisabled}
                rootClassName="dc__toggle-square-toggle"
                throttleOnChange={throttleOnChange}
                iconClass={`p-2-imp ${resolveScopedVariables ? 'scb-5' : 'scn-6'}`}
            />
        </div>
    </Tooltip>
)

export default ToggleResolveScopedVariables
