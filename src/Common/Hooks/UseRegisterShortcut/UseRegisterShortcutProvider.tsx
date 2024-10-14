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
import { UseRegisterShortcutContext } from './UseRegisterShortcutContext'
import { UseRegisterShortcutProviderType, ShortcutType, UseRegisterShortcutContextType } from './types'
import { preprocessKeys, verifyCallbackStack } from './utils'

const IGNORE_TAGS_FALLBACK = ['input', 'textarea', 'select']
const DEFAULT_TIMEOUT = 1000

const UseRegisterShortcutProvider = ({
    ignoreTags,
    preventDefault = false,
    shortcutTimeout,
    children,
}: UseRegisterShortcutProviderType) => {
    const disableShortcuts = useRef<boolean>(false)
    const shortcuts = useRef<Record<string, ShortcutType>>({})
    const keysDown = useRef<Set<string>>(new Set())
    const keyDownTimeout = useRef<ReturnType<typeof setTimeout>>(-1)
    const ignoredTags = ignoreTags ?? IGNORE_TAGS_FALLBACK

    const registerShortcut: UseRegisterShortcutContextType['registerShortcut'] = useCallback(
        ({ keys, callback, description = '' }) => {
            const { keys: processedKeys, id } = preprocessKeys(keys)
            if (typeof callback !== 'function') {
                throw new Error('callback provided is not a function')
            }

            const match =
                shortcuts.current[id] && deepEquals(shortcuts.current[id].keys, keys) ? shortcuts.current[id] : null

            if (match) {
                verifyCallbackStack(match.callbackStack)
                match.callbackStack.push(callback)
                return
            }

            shortcuts.current[id] = { keys: processedKeys, callbackStack: [callback], description }
        },
        [],
    )

    const unregisterShortcut: UseRegisterShortcutContextType['unregisterShortcut'] = useCallback((keys) => {
        const { id } = preprocessKeys(keys)

        if (!shortcuts.current[id]) {
            return
        }

        const { callbackStack } = shortcuts.current[id]
        verifyCallbackStack(callbackStack)
        callbackStack.pop()

        if (!callbackStack.length) {
            // NOTE: delete the shortcut only if all registered callbacks are unregistered
            // if 2 shortcuts are registered with the same keys then there needs to be 2 unregister calls
            delete shortcuts.current[id]
        }
    }, [])

    const setDisableShortcuts: UseRegisterShortcutContextType['setDisableShortcuts'] = useCallback((shouldDisable) => {
        disableShortcuts.current = shouldDisable
    }, [])

    const triggerShortcut: UseRegisterShortcutContextType['triggerShortcut'] = useCallback((keys) => {
        const { id } = preprocessKeys(keys)

        if (!shortcuts.current[id]) {
            return
        }

        const { callbackStack } = shortcuts.current[id]
        verifyCallbackStack(callbackStack)

        // NOTE: call the last callback in the callback stack
        callbackStack[callbackStack.length - 1]()
    }, [])

    const handleKeyupEvent = useCallback(() => {
        if (!keysDown.current.size) {
            return
        }

        const { id } = preprocessKeys(Array.from(keysDown.current.values()) as ShortcutType['keys'])

        if (shortcuts.current[id]) {
            const { callbackStack } = shortcuts.current[id]
            verifyCallbackStack(callbackStack)
            callbackStack[callbackStack.length - 1]()
        }

        keysDown.current.clear()

        if (keyDownTimeout.current > -1) {
            clearTimeout(keyDownTimeout.current)
            keyDownTimeout.current = -1
        }
    }, [])

    const handleKeydownEvent = useCallback((event: KeyboardEvent) => {
        if (keyDownTimeout.current === -1) {
            keyDownTimeout.current = setTimeout(() => {
                handleKeyupEvent()
            }, shortcutTimeout ?? DEFAULT_TIMEOUT)
        }

        if (preventDefault) {
            event.preventDefault()
        }

        if (
            ignoredTags.map((tag) => tag.toUpperCase()).indexOf((event.target as HTMLElement).tagName.toUpperCase()) >
            -1
        ) {
            return
        }

        if (!disableShortcuts.current) {
            keysDown.current.add(event.key.toUpperCase())

            if (event.ctrlKey) {
                keysDown.current.add('CONTROL')
            }
            if (event.metaKey) {
                keysDown.current.add('META')
            }
            if (event.altKey) {
                keysDown.current.add('ALT')
            }
            if (event.shiftKey) {
                keysDown.current.add('SHIFT')
            }
        }
    }, [])

    const handleBlur = useCallback(() => {
        keysDown.current.clear()
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeydownEvent)
        window.addEventListener('keyup', handleKeyupEvent)
        window.addEventListener('blur', handleBlur)

        return () => {
            window.removeEventListener('keydown', handleKeydownEvent)
            window.removeEventListener('keyup', handleKeyupEvent)
            window.removeEventListener('blur', handleBlur)
        }
    }, [handleKeyupEvent, handleKeydownEvent, handleBlur])

    const providerValue: UseRegisterShortcutContextType = useMemo(
        () => ({
            registerShortcut,
            unregisterShortcut,
            setDisableShortcuts,
            triggerShortcut,
        }),
        [registerShortcut, unregisterShortcut, setDisableShortcuts, triggerShortcut],
    )

    return <UseRegisterShortcutContext.Provider value={providerValue}>{children}</UseRegisterShortcutContext.Provider>
}

export default UseRegisterShortcutProvider
