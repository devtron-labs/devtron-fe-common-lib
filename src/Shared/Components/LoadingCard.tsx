interface LoadingCardType {
    wider?: boolean
}

const LoadingCard = ({ wider }: LoadingCardType) => (
    <div
        className={`app-details-info-card pointer flex left bg__primary br-8 mr-12 lh-20 ${wider ? 'w-250' : 'w-200'}`}
    >
        <div className="app-details-info-card__top-container">
            <div className="shimmer-loading w-120 h-14 br-2 mb-6" />
            <div className="shimmer-loading w-80px h-18 br-2 mb-6" />
        </div>
        <div className="app-details-info-card__bottom-container">
            <div className="shimmer-loading w-100 h-14 br-2" />
        </div>
    </div>
)

export default LoadingCard
