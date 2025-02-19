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

import { IS_PLATFORM_MAC_OS } from '@Common/Constants'
import { SupportedKeyboardKeysType } from '@Common/Hooks/UseRegisterShortcut/types'

export const PREVIOUS_MATCH_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Shift', 'Enter']
export const NEXT_MATCH_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Enter']
export const REPLACE_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Enter']
export const REPLACE_ALL_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = [IS_PLATFORM_MAC_OS ? 'Meta' : 'Control', 'Enter']
export const SELECT_ALL_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Alt', 'Enter']
export const CLOSE_SEARCH_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = ['Escape']

export const READ_ONLY_TOOLTIP_TIMEOUT = 2000
