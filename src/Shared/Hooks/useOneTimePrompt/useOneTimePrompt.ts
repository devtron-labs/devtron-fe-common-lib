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

import { useEffect, useRef, useState } from 'react'

import { ONE_TIME_PROMPT_LOCAL_STORAGE_KEY } from './constants'
import { UseOneTimePromptProps } from './types'

const getOneTimePromptLocalStorageValue = () => {
    try {
        return JSON.parse(localStorage.getItem(ONE_TIME_PROMPT_LOCAL_STORAGE_KEY)) ?? {}
    } catch {
        return {}
    }
}

export const useOneTimePrompt = ({ localStorageKey }: UseOneTimePromptProps) => {
    // STATES
    const [hidePrompt, setHidePrompt] = useState<boolean>(true)

    // REFS
    const hasUserClickedOnClose = useRef<boolean>(false)

    useEffect(() => {
        const oneTimePromptLocalStorageValue = getOneTimePromptLocalStorageValue()
        setHidePrompt(oneTimePromptLocalStorageValue[localStorageKey])
    }, [])

    // HANDLERS
    const handleClose = () => {
        hasUserClickedOnClose.current = true
        setHidePrompt(true)
    }

    const handleDoNotShowAgainClose = () => {
        handleClose()

        const oneTimePromptLocalStorageValue = getOneTimePromptLocalStorageValue()
        localStorage.setItem(
            ONE_TIME_PROMPT_LOCAL_STORAGE_KEY,
            JSON.stringify({ ...oneTimePromptLocalStorageValue, [localStorageKey]: true }),
        )
    }

    return {
        showPrompt: !hasUserClickedOnClose.current && !hidePrompt,
        handleClose,
        handleDoNotShowAgainClose,
    }
}
