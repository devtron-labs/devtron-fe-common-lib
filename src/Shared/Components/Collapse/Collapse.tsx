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

import { AnimatePresence, motion } from 'framer-motion'

import { CollapseProps } from './types'

/**
 * Collapse component for smoothly expanding or collapsing its content.
 * It also supports a callback when the transition ends.
 */
export const Collapse = ({ expand, onTransitionEnd, children }: CollapseProps) => (
    <AnimatePresence>
        {expand && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, easings: ['easeOut'] }}
                onTransitionEnd={onTransitionEnd}
                style={{ overflow: 'hidden' }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
)
