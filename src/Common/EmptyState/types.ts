import { GenericEmptyStateType } from '../Types'

export type GenericFilterEmptyStateProps = Omit<
    GenericEmptyStateType,
    'image' | 'title' | 'subTitle' | 'isButtonAvailable' | 'renderButton'
> &
    Partial<Pick<GenericEmptyStateType, 'title' | 'subTitle'>> &
    (
        | {
              /**
               * If provided, it will have priority over the isButtonAvailable prop
               * and render clear filter button
               */
              handleClearFilters?: () => void
              isButtonAvailable?: never
              renderButton?: never
          }
        | (Pick<GenericEmptyStateType, 'isButtonAvailable' | 'renderButton'> & {
              handleClearFilters?: never
          })
    )
