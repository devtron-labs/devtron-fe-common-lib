import { GenericEmptyStateType } from '../Types'
import noResult from '../../Assets/Img/empty-noresult@2x.png'
import GenericEmptyState from './GenericEmptyState'

const GenericFilterEmptyState = (
    props: Omit<GenericEmptyStateType, 'image' | 'title' | 'subTitle'> &
        Partial<Pick<GenericEmptyStateType, 'title' | 'subTitle'>>,
) => (
    <GenericEmptyState
        image={noResult}
        title="No results"
        subTitle="We couldn’t find any matching results"
        {...props}
    />
)

export default GenericFilterEmptyState
