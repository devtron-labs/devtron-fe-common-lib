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

import { createContext, PropsWithChildren, useContext, useMemo, useRef, useState } from 'react'
import { ConfirmationModalContextType } from './types'

export const ConfirmationModalContext = createContext<ConfirmationModalContextType>(null)

export const ConfirmationModalProvider = ({ children }: PropsWithChildren<{}>) => {
    const settersRef = useRef<ConfirmationModalContextType['settersRef']['current']>(null)
    const [modalKey, setModalKey] = useState('')

    const value = useMemo(() => ({ modalKey, setModalKey, settersRef }), [modalKey])

    return <ConfirmationModalContext.Provider value={value}>{children}</ConfirmationModalContext.Provider>
}

export const useConfirmationModalContext = () => useContext(ConfirmationModalContext)
