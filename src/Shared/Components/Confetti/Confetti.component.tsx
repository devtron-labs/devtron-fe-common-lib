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

import { ComponentProps } from 'react'
import Pride from 'react-canvas-confetti/dist/presets/pride'
import Snow from 'react-canvas-confetti/dist/presets/snow'

export const SnowConfetti = () => {
    const decorateOptions: ComponentProps<typeof Snow>['decorateOptions'] = (options) => ({
        ...options,
        colors: ['#a864fd'],
    })

    return (
        <Snow
            autorun={{ speed: 30 }}
            decorateOptions={decorateOptions}
            style={{
                height: '100%',
            }}
        />
    )
}

const Confetti = () => {
    const decorateOptions: ComponentProps<typeof Pride>['decorateOptions'] = (options) => ({
        ...options,
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    })

    return <Pride autorun={{ speed: 60, duration: 500 }} decorateOptions={decorateOptions} />
}

export default Confetti
