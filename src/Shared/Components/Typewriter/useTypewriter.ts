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

import { useEffect } from 'react'
import { animate, useMotionValue, useTransform } from 'framer-motion'

export const useTypewriter = (text: string) => {
    const progress = useMotionValue(0)

    const visibleText = useTransform(progress, (latest) => text.slice(0, Math.floor(latest)))

    useEffect(() => {
        const controls = animate(progress, text.length, {
            type: 'tween',
            duration: 4,
            ease: 'linear',
        })

        return controls.stop
    }, [text])

    return visibleText
}
