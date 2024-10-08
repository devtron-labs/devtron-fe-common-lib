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

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { deepEquals } from '@rjsf/utils'
import { context } from './UseRegisterShortcutContext'
import { UseRegisterShortcutProviderType, ShortcutType } from './types'
import { preprocessKeys } from './utils'

const ignoreTags = ['INPUT'].map((key) => key.toUpperCase())

const UseRegisterShortcutProvider = ({ children }: UseRegisterShortcutProviderType) => {
    const disableShortcuts = useRef<boolean>()
    const shortcuts = useRef<Array<ShortcutType>>([])
    const keysDown = useRef<string[]>([])

    const registerShortcut = useCallback(({ keys, callback }: ShortcutType) => {
        const processedKeys = preprocessKeys(keys)
        const match = shortcuts.current.find((shortcut) => deepEquals(shortcut.keys, processedKeys))

        if (match) {
            match.callback = callback
            return
        }

        shortcuts.current.push({ keys: processedKeys, callback })
    }, [])

    const unregisterShortcut = useCallback((keys: ShortcutType['keys']) => {
        const processedKeys = preprocessKeys(keys)
        shortcuts.current = shortcuts.current.filter((shortcut) => !deepEquals(shortcut.keys, processedKeys))
    }, [])

    const setDisableShortcuts = useCallback((shouldDisable: boolean) => {
        disableShortcuts.current = shouldDisable
    }, [])

    const handleKeydownEvent = useCallback((event: KeyboardEvent) => {
        if (ignoreTags.indexOf((event.target as HTMLElement).tagName.toUpperCase()) > -1) {
            return
        }

        if (!disableShortcuts.current) {
            keysDown.current = [...keysDown.current, event.key.toUpperCase()]
        }
    }, [])

    const handleKeyupEvent = useCallback(() => {
        if (!keysDown.current.length) {
            return
        }

        shortcuts.current.forEach((shortcut) => {
            if (keysDown.current.every((key) => (shortcut.keys as string[]).includes(key.toUpperCase()))) {
                shortcut.callback()
            }
        })

        keysDown.current = []
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeydownEvent)
        window.addEventListener('keyup', handleKeyupEvent)

        return () => {
            window.removeEventListener('keydown', handleKeydownEvent)
            window.removeEventListener('keyup', handleKeyupEvent)
        }
    }, [])

    const providerValue = useMemo(
        () => ({
            registerShortcut,
            unregisterShortcut,
            setDisableShortcuts,
        }),
        [],
    )

    return <context.Provider value={providerValue}>{children}</context.Provider>
}

export default UseRegisterShortcutProvider
