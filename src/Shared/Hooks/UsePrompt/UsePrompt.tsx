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

import { useCallback, useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

import { DEFAULT_ROUTE_PROMPT_MESSAGE } from '@Shared/index'

import { UsePromptProps } from './types'

/**
 * Hook that shows a prompt when shouldPrompt is true and the user tries to leave the page through refresh
 */
const usePrompt = ({ shouldPrompt, message = DEFAULT_ROUTE_PROMPT_MESSAGE }: UsePromptProps) => {
    const handlePageLeave = useCallback(
        (e: BeforeUnloadEvent) => {
            if (shouldPrompt) {
                e.preventDefault()
            }
        },
        [shouldPrompt],
    )

    useEffect(() => {
        window.addEventListener('beforeunload', handlePageLeave)

        return () => {
            window.removeEventListener('beforeunload', handlePageLeave)
        }
    }, [handlePageLeave])

    const blocker = useBlocker(shouldPrompt)

    useEffect(() => {
        if (!blocker || blocker.state !== 'blocked') {
            return
        }

        if (!shouldPrompt) {
            blocker.proceed()
            return
        }

        // eslint-disable-next-line no-alert
        const proceed = window.confirm(message)

        if (proceed) {
            blocker.proceed()
        } else {
            blocker.reset()
        }
    }, [blocker, message, shouldPrompt])
}

export default usePrompt
