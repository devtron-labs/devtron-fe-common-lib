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

import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

import { noop } from '@Common/Helper'

import { GenericModalContextType } from './types'

const GenericModalContext = createContext<GenericModalContextType>({
    name: 'dummy-generic-modal-name',
    onClose: noop,
})

export const GenericModalProvider = ({ value, children }: PropsWithChildren<{ value: GenericModalContextType }>) => {
    const contextValue = useMemo(() => value, [value])

    return <GenericModalContext.Provider value={contextValue}>{children}</GenericModalContext.Provider>
}

export const useGenericModalContext = () => {
    const context = useContext(GenericModalContext)

    if (!context) {
        throw new Error(`Generic Modal components cannot be rendered outside the GenericModal`)
    }

    return context
}
