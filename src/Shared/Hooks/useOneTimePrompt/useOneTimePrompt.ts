import { useEffect, useRef, useState } from 'react'

import { UseOneTimePromptProps } from './types'
import { ONE_TIME_PROMPT_LOCAL_STORAGE_KEY } from './constants'

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
