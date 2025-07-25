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

import { FocusEvent, KeyboardEvent } from 'react'

import { IS_PLATFORM_MAC_OS } from '@Common/Constants'

// NOTE: check this link for more info on keyboard keys: https://w3c.github.io/uievents-key/
export const KEYBOARD_KEYS_MAP = {
    Control: 'Ctrl',
    Shift: '⇧',
    Meta: IS_PLATFORM_MAC_OS ? '⌘' : 'Win',
    Alt: IS_PLATFORM_MAC_OS ? '⌥' : 'Alt',
    F: 'F',
    E: 'E',
    R: 'R',
    K: 'K',
    X: 'X',
    A: 'A',
    N: 'N',
    S: 'S',
    '/': '/',
    Escape: 'Esc',
    Enter: '↩',
    ArrowLeft: '←',
    ArrowRight: '→',
    ArrowUp: '↑',
    ArrowDown: '↓',
    PageUp: 'PgUp',
    PageDown: 'PgDn',
    Home: 'Home',
    End: 'End',
    Backspace: '⌫',
    Delete: '⌦',
    '.': '.',
    Space: 'Space',
} as const

export type SupportedKeyboardKeysType = keyof typeof KEYBOARD_KEYS_MAP

export interface ShortcutType {
    keys: SupportedKeyboardKeysType[]
    callbackStack: Array<() => void>
    description?: string
}

interface RegisterShortcutType extends Pick<ShortcutType, 'keys' | 'description'> {
    callback: ShortcutType['callbackStack'][number]
}

export interface UseRegisterShortcutContextType {
    /**
     * This method registers a shortcut with its corresponding callback
     *
     * If keys is undefined or null this method will throw an error
     */
    registerShortcut: (props: RegisterShortcutType) => void
    /**
     * This method unregisters the provided shortcut if found
     *
     * If keys is undefined or null this method will throw an error
     */
    unregisterShortcut: (keys: ShortcutType['keys']) => void
    /**
     * Globally disable all shortcuts with this function
     */
    setDisableShortcuts: (shouldDisable: boolean) => void
    /**
     * Programmatically trigger a shortcut if already registered
     */
    triggerShortcut: (keys: ShortcutType['keys']) => void
    /**
     * If shouldHookOntoWindow is false, these props need to be hooked onto
     * the component that needs to listen to the shortcuts
     */
    targetProps?: {
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
        onKeyUp: (event: KeyboardEvent<HTMLElement>) => void
        onBlur: (event: FocusEvent<HTMLElement>) => void
    }
}

export interface UseRegisterShortcutProviderType {
    /**
     * If false, the shortcuts will not be registered to the window object
     * instead onKeyDown, onKeyUp and onBlur will be exposed as context methods
     * which need to be hooked onto the component that needs to listen to the shortcuts
     *
     * defaults to true
     */
    shouldHookOntoWindow?: boolean
    children: React.ReactNode
    /**
     * Defines how long after holding the keys down do we trigger the callback in milliseconds
     */
    shortcutTimeout?: number
    /**
     * Defines which html tags to ignore as source of an event
     */
    ignoreTags?: string[]
    /**
     * If true, call preventDefault on the event
     */
    preventDefault?: boolean
}
