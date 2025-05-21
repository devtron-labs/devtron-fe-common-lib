interface LoadingCardType {
    wider?: boolean
}

const LoadingCard = ({ wider }: LoadingCardType) => (
    <div
        // TODO: Remove margin and use gap
        className={`flexbox-col ${wider ? 'w-250' : 'w-200'} bg__primary border__secondary-translucent br-8 mr-16`}
        style={{
            boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.20)',
        }}
    >
        <div className="flexbox-col dc__gap-8 px-12 pt-12 pb-8">
            <span className="w-60 h-14 shimmer" />
            <span className="w-120 h-18 shimmer" />
        </div>
        <div className="flexbox px-12 py-10 border__secondary--top">
            <span className="w-44 h-14 shimmer" />
        </div>
    </div>
)

export default LoadingCard
