import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import LoginBannerImg from '@Images/login-screen-ui.webp'
import { Icon } from '../Icon'
import { TESTIMONIAL_CARD_DATA, TESTIMONIAL_CARD_INTERVAL, TRANSITION_EASE_CURVE } from './constants'

const AnimatedBackground = () => (
    <motion.div>
        <svg
            width="2400"
            height="3600"
            viewBox="0 0 2400 3600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: '-50px',
                left: 0,
                filter: 'blur(55px)',
            }}
        >
            <motion.circle
                cx="1200"
                cy="2257"
                r="2000"
                fill="#FD0000"
                animate={{ scale: [1, 0.9], y: [0, 50] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.circle
                cx="418"
                cy="2953"
                r="1750"
                fill="#D10CD5"
                animate={{
                    scale: [1, 0.5],
                    x: [0, 1000],
                    rotate: [0, 60],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.circle
                cx="418"
                cy="2953"
                r="1525"
                fill="#A412DF"
                animate={{ scale: [0.8, 1], x: [0, 50], y: [-100, 200] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.circle
                cx="418"
                cy="2953"
                r="1315"
                fill="#70CDFF"
                animate={{
                    scale: [1, 0.5],
                    x: [0, 1000],
                    rotate: [0, 60],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.ellipse
                cx="759.5"
                cy="2893"
                rx="973.5"
                ry="975"
                fill="white"
                animate={{ scale: [0.8, 1], x: [0, 50], y: [-100, 200] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.path
                d="M1449.92 730.265C1649.97 261.314 2460.84 884.083 2656.59 1131.43C2852.35 1378.78 3240.21 2146.55 2913.48 2307.57C2508.24 2507.29 2384.89 1871.7 2116.5 1567.52C1848.1 1263.34 1326.48 1019.64 1449.92 730.265Z"
                fill="white"
                animate={{
                    d: [
                        'M1449.92 730.265C1649.97 261.314 2460.84 884.083 2656.59 1131.43C2852.35 1378.78 3240.21 2146.55 2913.48 2307.57C2508.24 2507.29 2384.89 1871.7 2116.5 1567.52C1848.1 1263.34 1326.48 1019.64 1449.92 730.265Z',
                        'M659.5 743.5C527.947 250.927 1702.5 356.5 2267 825.5C2831.5 1294.5 2825.95 1970.73 2476.5 2073.5C1657 2314.5 1824.89 1047.68 1556.5 743.5C1288.11 439.319 769 1153.5 659.5 743.5Z',
                    ],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.circle
                cx="1479"
                cy="915"
                r="215"
                fill="#FF9634"
                animate={{
                    scale: [1, 0.5],
                    x: [0, 1000],
                    rotate: [0, 60],
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            />
        </svg>
    </motion.div>
)

const LoginBanner = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isHovering, setIsHovering] = useState<boolean>(false)

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }

    useEffect(() => {
        const testimonialCount = TESTIMONIAL_CARD_DATA.length
        let interval: ReturnType<typeof setInterval>

        if (!isHovering) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialCount)
            }, TESTIMONIAL_CARD_INTERVAL)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isHovering])

    const { quote, name, designation, iconName } = TESTIMONIAL_CARD_DATA[currentIndex]

    return (
        <div className="flexbox-col br-12 border__primary dc__position-rel dc__overflow-hidden bg__primary">
            <div className="flexbox-col flex-grow-1 dc__content-space">
                <div className="pl-32 pt-32">
                    <div className="flex h-36 w-130 dc__fill-available-space dc__position-abs dc__zi-2">
                        <Icon name="ic-devtron-header-logo" color="N900" />
                    </div>
                </div>
                <AnimatedBackground />
                <img
                    className="dc__position-abs dc__top-180"
                    src={LoginBannerImg}
                    alt="login-image"
                    style={{
                        maxHeight: '90%',
                    }}
                />
            </div>
            <div className="p-40 dc__backdrop-filter bg__primary flex dc__gap-12 dc__zi-2">
                <div className="flexbox-col dc__align-items-center h-100 dc__gap-8">
                    <Icon name="ic-quote" color="N900" />
                    <div className="border__primary--left w-1 flex-grow-1" />
                </div>
                <motion.div
                    key={currentIndex}
                    variants={{
                        hidden: { opacity: 0, x: 200 },
                        visible: { opacity: 1, x: 0 },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{
                        staggerChildren: 0.3,
                        opacity: { duration: 0.75, ease: TRANSITION_EASE_CURVE },
                        x: { duration: 0.85, ease: TRANSITION_EASE_CURVE },
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="flexbox-col dc__gap-20"
                >
                    <div className="fs-14 fw-4 lh-1-5 cn-9 dc__truncate--clamp-4">{quote}&quot;</div>
                    <div className="flex dc__content-space">
                        <div>
                            <div className="fs-13 fw-6 lh-1-5 cn-9">{name}</div>
                            <div className="fs-12 fw-4 lh-1-5 cn-7 dc__truncate">{designation}</div>
                        </div>
                        {iconName && (
                            <div className="dc__fill-available-space w-auto-imp h-36">
                                <Icon name={iconName} color="N900" />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default LoginBanner
