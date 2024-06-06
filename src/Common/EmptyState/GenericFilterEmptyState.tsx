import noResult from '../../Assets/Img/empty-noresult@2x.png'
import GenericEmptyState from './GenericEmptyState'
import { GenericFilterEmptyStateProps } from './types'

/**
 * Empty state when no filters are applied
 */
const GenericFilterEmptyState = ({
    handleClearFilters,
    isButtonAvailable,
    renderButton,
    ...props
}: GenericFilterEmptyStateProps) => {
    const isClearFilterButtonAvailable = !!handleClearFilters

    const renderClearFilterButton = () => (
        <button type="button" onClick={handleClearFilters} className="cta secondary flex h-32 lh-20-imp">
            Clear Filters
        </button>
    )

    return (
        <GenericEmptyState
            image={noResult}
            title="No results"
            subTitle="We couldn’t find any matching results"
            {...props}
            isButtonAvailable={isClearFilterButtonAvailable || isButtonAvailable}
            renderButton={isClearFilterButtonAvailable ? renderClearFilterButton : renderButton}
        />
    )
}

export default GenericFilterEmptyState
