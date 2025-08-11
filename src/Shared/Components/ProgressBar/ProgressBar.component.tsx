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
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

import { ProgressBarProps } from './types'

export const ProgressBar = ({ isLoading, intervalTime = 50 }: ProgressBarProps) => {
    const progress = useMotionValue<number>(0)
    const smoothProgress = useSpring(progress, { stiffness: 50, damping: 20 })

    const width = useTransform(smoothProgress, (v) => `${v}%`)

    useEffect(() => {
        let interval = null

        if (isLoading) {
            interval = setInterval(() => {
                const next = progress.get() + Math.random() * 5
                progress.set(next < 95 ? next : 95)
            }, intervalTime)
        }

        return () => clearInterval(interval)
    }, [isLoading])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="dc__position-abs dc__top-0 dc__left-0 dc__zi-10 h-2 w-100 bcn-2"
                >
                    <motion.div
                        className="h-100 bcb-5"
                        style={{
                            width,
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
