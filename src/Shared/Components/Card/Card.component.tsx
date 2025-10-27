import { HTMLProps } from 'react'

import { DEFAULT_BORDER_RADIUS, DEFAULT_FLEX_GAP, VARIANT_TO_BORDER_CLASS_MAP } from './constants'
import { CardProps } from './types'

const Card = ({
    onClick,
    children,
    isLoading,
    shimmerVariant,
    variant = 'primary--outlined',
    flexGap = DEFAULT_FLEX_GAP,
    flexDirection = 'column',
    padding = 0,
}: CardProps) => {
    const divProps: HTMLProps<HTMLDivElement> = onClick
        ? {
              onClick,
              role: 'button',
              tabIndex: 0,
              onKeyDown: (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                      onClick()
                  }
              },
          }
        : {}

    const renderShimmerVariant = () => {
        switch (shimmerVariant) {
            case 'B':
                return (
                    <div className="flexbox dc__gap-12 p-16">
                        <div className="shimmer w-48 h-48 dc__no-shrink" />
                        <div className="flexbox-col dc__gap-8 flex-grow-1">
                            <div className="shimmer w-180 h-20" />
                            <div className="shimmer w-140 h-16" />
                        </div>
                    </div>
                )
            case 'C':
                return (
                    <div className="flexbox-col dc__gap-12 p-16">
                        <div className="shimmer w-100 h-24" />
                        <div className="shimmer w-100 flex-grow-1 mh-48" />
                    </div>
                )
            case 'A':
            default:
                return (
                    <div className="flexbox-col dc__gap-8 p-16">
                        <div className="shimmer w-200 h-20" />
                        <div className="shimmer w-150 h-16" />
                        <div className="shimmer w-120 h-16" />
                    </div>
                )
        }
    }

    const cardStyles = {
        borderRadius: `${DEFAULT_BORDER_RADIUS}px`,
        gap: `${flexGap}px`,
        padding: `${padding}px`,
    }

    const cardClasses = [
        VARIANT_TO_BORDER_CLASS_MAP[variant],
        flexDirection === 'column' ? 'flexbox-col' : 'flexbox',
        'dc__gap-16',
        'bg__primary',
        'dc__overflow-hidden',
        'dc__no-shrink',
        onClick ? 'cursor' : '',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div {...divProps} className={cardClasses} style={cardStyles}>
            {isLoading ? renderShimmerVariant() : children}
        </div>
    )
}

export default Card
