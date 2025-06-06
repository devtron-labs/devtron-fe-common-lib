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

import { ReactComponent as Var } from '@Icons/ic-var-initial.svg'
import { Tooltip } from '@Common/Tooltip'

const TIPPY_VAR_MSG = 'This is a variable. It will be replaced with the value during execution.'

export const SystemVariableIcon = () => (
    <Tooltip content={TIPPY_VAR_MSG} placement="left" animation="shift-away" alwaysShowTippyOnHover>
        <div className="flex">
            <Var className="icon-dim-18 icon-n4" />
        </div>
    </Tooltip>
)
