import { CardProps } from './types'

const Card = ({
    onClick,
    children,
    onHover,
    isLoading,
    borderConfig,
    padding = 20,
    flexDirection = 'column',
    flexGap = 16,
    shimmerVariant,
}: CardProps) => {
    const { borderRadius = 8, colorVariant = 'secondary' } = borderConfig ?? {
        borderRadius: 8,
        colorVariant: 'secondary',
    }

    const divProps = onClick
        ? { onClick, role: 'button', tabIndex: 0 }
        : {
              onHover,
          }

    const renderShimmerVariant = () => {
        switch (shimmerVariant) {
            case 'A':
                return (
                    <div className="flexbox-col dc__gap-8">
                        <div className="shimmer w-200 h-20" />
                        <div className="shimmer w-150 h-16" />
                        <div className="shimmer w-120 h-16" />
                    </div>
                )
            case 'B':
                return (
                    <div className="flexbox dc__gap-12">
                        <div className="shimmer w-48 h-48 dc__no-shrink" />
                        <div className="flexbox-col dc__gap-8 flex-grow-1">
                            <div className="shimmer w-180 h-20" />
                            <div className="shimmer w-140 h-16" />
                        </div>
                    </div>
                )
            case 'C':
                return (
                    <div className="flexbox-col dc__gap-12">
                        <div className="shimmer w-100 h-24" />
                        <div className="flexbox-col dc__gap-4">
                            <div className="shimmer w-100 h-16" />
                            <div className="shimmer w-80 h-16" />
                        </div>
                        <div className="flexbox dc__gap-8">
                            <div className="shimmer w-60 h-14" />
                            <div className="shimmer w-60 h-14" />
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="flexbox-col dc__gap-8">
                        <div className="shimmer w-200 h-20" />
                        <div className="shimmer w-150 h-16" />
                        <div className="shimmer w-120 h-16" />
                    </div>
                )
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return renderShimmerVariant()
        }

        return children
    }

    const getBorderClass = () => {
        switch (colorVariant) {
            case 'primary':
                return 'border__primary'
            case 'secondary':
                return 'border__secondary'
            case 'primary--translucent':
                return 'border__primary-translucent'
            case 'secondary--translucent':
                return 'border__secondary-translucent'
            default:
                return 'border__secondary'
        }
    }

    const getFlexDirectionClass = () => {
        switch (flexDirection) {
            case 'row':
                return 'flexbox'
            case 'column':
                return 'flexbox-col'
            default:
                return 'flexbox-col'
        }
    }

    const cardStyles = {
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        gap: `${flexGap}px`,
    }

    const cardClasses = [getBorderClass(), getFlexDirectionClass(), 'bg__primary', onClick ? 'cursor' : '']
        .filter(Boolean)
        .join(' ')

    return (
        <div {...divProps} className={cardClasses} style={cardStyles}>
            {renderContent()}
        </div>
    )
}

export default Card
