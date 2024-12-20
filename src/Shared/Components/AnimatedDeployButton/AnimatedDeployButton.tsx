import { motion } from 'framer-motion'
import { ReactComponent as ICDeploy } from '@Icons/ic-nav-rocket.svg'
import { ComponentSizeType } from '@Shared/constants'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../Button'
import DeployAudio from '../../../Assets/Sounds/DeployAudio.mp3'
import './animatedDeployButton.scss'

const AnimatedDeployButton = ({ onButtonClick }: { onButtonClick: (e, disableDeployButton: boolean) => void }) => {
    const audioRef = useRef<HTMLAudioElement>()
    const isAudioEnabled: boolean = window._env_.FEATURE_ACTION_AUDIOS_ENABLE
    const [clicked, setClicked] = useState<boolean>(false)
    const svgMotionVariants = {
        hover: {
            rotate: 45,
        },
    }

    const handleButtonClick = async (e) => {
        if (isAudioEnabled && audioRef.current) {
            await audioRef.current.play()
        }
        setClicked(true)
        setTimeout(() => {
            setClicked(false)
            onButtonClick(e, false)
        }, 700)
    }

    useEffect(
        () => () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        },
        [],
    )

    return (
        <motion.div whileHover="hover" className={`${clicked ? 'hide-button-text' : ''}`}>
            <Button
                dataTestId="cd-trigger-deploy-button"
                text="Deploy"
                startIcon={
                    <motion.div
                        variants={svgMotionVariants}
                        animate={
                            clicked
                                ? {
                                      x: 100,
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
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio hidden ref={audioRef} src={DeployAudio} />
        </motion.div>
    )
}

export default AnimatedDeployButton
