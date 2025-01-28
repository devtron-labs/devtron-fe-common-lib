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

import { KEYBOARD_KEYS_MAP } from '@Common/Hooks/UseRegisterShortcut/types'
import { TooltipProps } from './types'

const ShortcutKeyComboTooltipContent = ({ text, combo }: TooltipProps['shortcutKeyCombo']) => (
    <div className="flexbox dc__gap-8 px-8 py-4 flex-wrap">
        <span className="lh-18 fs-12 fw-4 text__white">{text}</span>
        {!!combo?.length && (
            <div className="flexbox dc__gap-4 dc__align-items-center flex-wrap">
                {combo.map((key) => (
                    <span key={key} className="shortcut-keys__chip dc__capitalize lh-16 fs-11 fw-5 flex">
                        {KEYBOARD_KEYS_MAP[key]}
                    </span>
                ))}
            </div>
        )}
    </div>
)

export default ShortcutKeyComboTooltipContent
