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

import { motion } from 'framer-motion'
import { ReactComponent as ICDeploy } from '@Icons/ic-nav-rocket.svg'
import { ComponentSizeType } from '@Shared/constants'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import DeployAudio from '@Sounds/DeployAudio.mp3'
import { Button } from '../Button'
import './animatedDeployButton.scss'
import { AnimatedDeployButtonProps } from './types'

const AnimatedDeployButton = ({ isVirtualEnvironment, onButtonClick }: AnimatedDeployButtonProps) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
    const isAudioEnabled: boolean = window._env_.FEATURE_ACTION_AUDIOS_ENABLE
    const [clicked, setClicked] = useState<boolean>(false)
    const svgMotionVariants = {
        hover: {
            rotate: 45,
        },
    }

    const handleButtonClick = async (e: SyntheticEvent) => {
        if (clicked) {
            return
        }
        if (isAudioEnabled && audioRef.current) {
            try {
                await audioRef.current.play()
            } catch {
                // do nothing
            }
        }
        setClicked(true)
        timeoutRef.current = setTimeout(() => {
            setClicked(false)
            onButtonClick(e, false)
        }, 700)
    }

    useEffect(
        () => () => {
            clearTimeout(timeoutRef.current)
        },
        [],
    )

    return (
        <motion.div whileHover="hover" className={`${clicked ? 'hide-button-text' : ''}`}>
            <Button
                dataTestId="cd-trigger-deploy-button"
                text={`Deploy${isVirtualEnvironment ? ' to isolated env' : ''}`}
                startIcon={
                    <motion.div
                        variants={svgMotionVariants}
                        animate={
                            clicked
                                ? {
                                      x: 200,
                                      rotate: 45,
                                      transition: {
                                          duration: 0.5,
                                          delay: 0.1,
                                      },
                                  }
                                : {}
                        }
                    >
                        <ICDeploy className="icon-dim-16" />
                    </motion.div>
                }
                size={ComponentSizeType.large}
                onClick={handleButtonClick}
            />
            {/* Disabling es-lint as captions are not required */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio hidden ref={audioRef} src={DeployAudio} />
        </motion.div>
    )
}

export default AnimatedDeployButton
